import { Inject,Injectable } from '@nestjs/common';
import { RsRepo } from './rs.repo';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
//@ts-ignore
import { ConditionType } from 'utils/query_custom';
//@ts-ignore
import {formatDate,formatTime} from 'utils/handle'
import {SignIn} from "../@types/rs.types"
import {firstValueFrom} from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class RsService {
    constructor(
      @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
      private readonly rsRepo: RsRepo,
      private readonly jwtService: JwtService,
    ) { }

     private generateToken = (id: number,role:number) => {
        const token = this.jwtService.sign({ id,role }, { expiresIn: "8h" })
        const expired = this.jwtService.decode(token).exp
        return {
            t: token,e: expired
        }

    }
    private encodePass = (password: string) => {
        const saltRound = process.env.SALT as string
        const salt = bcrypt.genSaltSync(Number(saltRound));
        return bcrypt.hashSync(password, salt);
    }
    private decodePass = (password: string, hash: string) => {
        return bcrypt.compareSync(password, hash)
    }
    async authSignIn(data:{username:string,password:string}){
      try{
        const {username,password} = data
        const key = `auth_${username}`
        /* Get auth data from redis and check. If data does not exist in redis, it will get data from database*/
        const redisData = await firstValueFrom(this.natsClient.send('redis_get', {key}))
        const authData = redisData ? [redisData] : await this.rsRepo.getData('username',username)
        //
        if(!redisData) {
          const data = [
            {
              key:`auth_${username}`,
              value:{
                employee_id: authData[0]?.employee_id,
                username:authData[0]?.username,
                password_hash: authData[0]?.password_hash,
                failed_login_attempts: authData[0]?.failed_login_attempts,
                is_locked: authData[0]?.is_locked
              }
            }
          ]
          await firstValueFrom(this.natsClient.send('redis_set', data))
        }
        if(authData.length === 0) return {
          status: 401,
          message:"Username does not exist"
        }
        if(authData[0]?.is_locked === 1) return {
          status: 401,
          message:"Account is locked"
        }
        const isPasswordMatch = this.decodePass(password, authData[0]?.password_hash)
        const condition:ConditionType = {
          conditionName: "username",
          conditionMethod: '=',
          value: username
        }
        if(!isPasswordMatch && authData[0].failed_login_attempts === 5){
            const dataUpdate = [
              {column: "is_locked",value: 1}
            ]
            await firstValueFrom(this.natsClient.send('redis_update', {key:"is_locked",field:"is_locked",value: 1}))
            await this.rsRepo.updateDataAuth(dataUpdate,condition)
            return {
              status: 401,
              message:"Account is locked"
            }
        }

        if(!isPasswordMatch) {
          const dataUpdate = [
            {column: "failed_login_attempts",value: authData[0]?.failed_login_attempts + 1}
          ]
          await firstValueFrom(this.natsClient.send('redis_update', {key,field:"failed_login_attempts",value:authData[0]?.failed_login_attempts + 1}))
          await this.rsRepo.updateDataAuth(dataUpdate,condition)
          return {
            status: 401,
            message:"Password is incorrect"
          }
        }
        const role = await firstValueFrom(this.natsClient.send('getRoleByEmployee', {id: authData[0]?.employee_id}))
        const token = this.generateToken(authData[0]?.employee_id,role?.data[0]?.role_id)
        const date = `${formatDate(new Date())} ${formatTime(new Date())}`
        const dataUpdate = [
          {column: "last_login",value:date},
          {column: "failed_login_attempts",value: 0}
        ]
        await firstValueFrom(this.natsClient.send('redis_update', {key,field:"failed_login_attempts",value:0}))
        await this.rsRepo.updateDataAuth(dataUpdate,condition)
        return {
          status:200,
          data:token
        }
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }

    //Sign Up
    async authSignUp(data:SignIn[]){
      const date = new Date()
      const date_data = `${formatDate(date)} ${formatTime(date)}`
      const employee_data = data.map((d:SignIn) => d.employee).map((d:any) => ({
        ...d,
        created_at: date_data,
      }))
      const employee_insert = await firstValueFrom(this.natsClient.send('createEmployee', {
        table:'employees',
        employee: employee_data
      }))
      if(employee_insert.status !== 201) return {
        status: employee_insert.status,
        message: employee_insert.message
      }
      const firstId = employee_insert.data.id
      const listId = data.map((d:SignIn,index) => firstId + index)

      try{
        const role_data = data.map((d:any,index:number) => ({
          employee_id: listId[index],
          assigned_at: date_data,
          ...d.role
        }))
        const team_data = data.map((d:any,index:number) => ({
          employee_id: listId[index],
          joined_at: date_data,
          ...d.team
        }))
        const authData = data.map((d:any,index:number) => ({
          employee_id: listId[index],
          username: d.auth.username,
          password_hash: this.encodePass(d.auth.password),
          created_at: date_data,
        }))
        const dataRedis = authData.map((d:any) => ({
          key: `auth_${d.username}`,
          value: {
            employee_id: d.employee_id,
            username: d.username,
            password_hash: d.password_hash,
            failed_login_attempts: 0,
            is_locked: 0
          }
        }))

        // Insert Data
        const [auth,role,team] = await Promise.all([
          this.rsRepo.insertDataAuth(authData),
          firstValueFrom(this.natsClient.send('createEmployee', {
            table:'employee_roles',
            employee: role_data
          })),
          firstValueFrom(this.natsClient.send('createEmployee', {
            table:'team_members',
            employee: team_data
          }))

        ])
        if(!auth || role.status !== 201 || team.status !== 201) {
          await Promise.all([
            this.rsRepo.deleteAuth('employee_id', listId),
            firstValueFrom(this.natsClient.send('deleteFromEmployees', {table:'employee_roles',value:listId})),
            firstValueFrom(this.natsClient.send('deleteFromEmployees', {table:'team_members',value:listId}))
          ])
          firstValueFrom(this.natsClient.send('deleteFromEmployees', {table:'employees',value:listId}))
          return {
            status: 404,
            message: 'Sign Up Failed'
          }
        }
        /* insert auth data into redis to optimize performance server */
         await firstValueFrom(this.natsClient.send('redis_set',dataRedis))
        //

        return {
          status:201,
          message:"Sign Up Account Success",
          data:data.map((d:SignIn,index:number) => ({
            employee_id: listId[index],
            first_name: d.employee.first_name,
            last_name: d.employee.last_name,
            email: d.employee.email,
            role:{
              team_id: d.team.team_id,
              role: d.team.role
            },
            created_ad: d.employee.created_at
          }))
        }

      }catch(e){
        Promise.all([
            this.rsRepo.deleteAuth('employee_id', listId),
            firstValueFrom(this.natsClient.send('deleteFromEmployees', {table:'employee_roles',value:listId})),
            firstValueFrom(this.natsClient.send('deleteFromEmployees', {table:'team_members',value:listId}))
          ]),
          firstValueFrom(this.natsClient.send('deleteFromEmployees', {table:'employees',value:listId})),
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }    
    }

    async updatePassword (data:{id:number,current:string,new:string}) {
      const getPassword = await this.rsRepo.getData('employee_id',data.id,["username","password_hash"])
      if(!getPassword) return {
        status:404,
        message:"Data Not Found"
      }
      const isMatchPassword = this.decodePass(data.current, getPassword[0].password_hash)
      if(!isMatchPassword) return {
        status:404,
        message:"Wrong Password"
      }
     const newPassword = this.encodePass(data.new)
     const condition:ConditionType = {
       conditionName:"employee_id",
       conditionMethod:"=",
       value:data.id
     }
     const res = await this.rsRepo.updateDataAuth([
       {
         column:"password_hash",
         value:newPassword
       }
     ],condition)
     await firstValueFrom(this.natsClient.send('redis_update', {
       key:`auth_${getPassword[0].username}`,
       field:"password_hash",value:newPassword}))

     if(!res) return {
       status:404,
       message:"Update Password Failed"
     }
     return {
       status:200,
       message:"Update Password Success"
     }
    }
}
