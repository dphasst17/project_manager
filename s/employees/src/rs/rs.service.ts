import { Injectable } from '@nestjs/common';
import { RsRepo } from './rs.repo';
//@ts-ignore
import { ValueType } from "utils/query_custom";
//@ts-ignore
import {formatDate,formatTime} from "utils/handle"
import { DB } from 'src/@types/rs.types';
@Injectable()
export class RsService {
    constructor(private readonly rsRepo: RsRepo) { }
    async getEmployees(page: number, limit: number) {
     try{
        const countEmployees = await this.rsRepo.countEmployees()
        const res = await this.rsRepo.getEmployees(page, limit)
        const total:number = Number(countEmployees[0].count)
        const totalPage:number = Math.ceil(total / limit)
        const result = {
          total,
          limit,
          page,
          totalPage,
          data:res
        }
        return {
          status:200,
          data:result
        }
     }catch(e){
       console.log(e)
       return {
         status:500,
         message:"Internal Server Error"
       }
     }
    }

    async getRoleByEmployee(id:number) {
      try{
        const data = await this.rsRepo.getRoleByEmployee(id)
        return {
          status:200,
          data
        }
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }

    async getEmployeesById(id: number) {
      try{
        const data = await this.rsRepo.getEmployeesById(id)
        return {
          status:200,
          data:!data ? [] : data.map((d:any) => ({
            ...d,
            author:d.author[0].role_id,
            role:d.role[0]?.role ? d.role[0].role : ''
          }))
        }
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }
    async getTeams() {
      try{
        const data = await this.rsRepo.getTeams()
        return {
          status:200,
          data
        }
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }
    async getTeamMemberById(id: number) {
      try{
        const data = await this.rsRepo.getTeamMemberById(id)
        return {status:200,data}
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }
    //update interface
    async addTeamMember(team_member:any) {
      try{
        const data = await this.rsRepo.addTeamMember(team_member)
        return data
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }
    async createEmployee(table:'employees' | 'employee_roles' | 'team_members',employee:any) {
      const data = await this.rsRepo.createEmployee(table,employee)
      return data ? {status:201,data:{id:Number(data[0].insertId)}} : {status:500,message:"Internal Server Error"}
    }
    async updateEmployee(id:number,employee:ValueType[]) {
      try{
        const data = await this.rsRepo.updateEmployee(id,employee)
        return data
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }

    async createTeam(team:DB['teams'][]) {
      try{
        const date = new Date()
        const newDate = `${formatDate(date)} ${formatTime(date)}`
        const addCreatedAt = team.map((t:any) => {
          return {
            ...t,
            created_at: newDate
          }
        })
        const data = await this.rsRepo.createTeam(addCreatedAt)
        return {status:201,data:addCreatedAt.map((d:any,index:number) => {
          return {
            ...d,
            team_id:Number(data[index].insertId)
          }
        })}
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }
    async updateTeam(id:number,team:ValueType[]) {
      try{
        const data = await this.rsRepo.updateTeam(id,team)
        return data
      }catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }
    //
    async deleteFromEmployees(table:'employees' | 'employee_roles' | 'team_members',value: number[]) {
      try{
        const handle_query = table == 'employees' ? this.rsRepo.deleteFromEmployees 
          : (table == 'employee_roles' ? this.rsRepo.deleteFromEmployeeRoles : this.rsRepo.deleteFromTeamMembers)
        const data = await handle_query(value)
        return data}
      catch(e){
        console.log(e)
        return {
          status:500,
          message:"Internal Server Error"
        }
      }
    }
    async getLastIdEmploy() {
      const data = await this.rsRepo.getLastIdEmploy()
      return data
    }
}
