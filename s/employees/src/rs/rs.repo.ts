import { InjectKysely } from "nestjs-kysely";
import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'src/@types/rs.types';
import { jsonArrayFrom} from "kysely/helpers/mysql";
//@ts-ignore
import { ValueType,updateDataByCondition } from 'utils/query_custom';

@Injectable()
export class RsRepo {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) { }
    async getEmployees(page: number, limit: number) {
        const data = await this.db.selectFrom('employees')
        .select<any>((eb:any) => [
          "employees.employee_id","first_name","last_name","email","created_at",
          jsonArrayFrom(
            eb.selectFrom('team_members')
            .select(['team_members.team_id','team_members.role'])
            .whereRef('employees.employee_id', '=', 'team_members.employee_id')
            .leftJoin('teams', 'teams.team_id', 'team_members.team_id')
          ).as('role')
        ])
        .leftJoin("employee_roles", "employee_roles.employee_id", "employees.employee_id")
        .leftJoin("roles", "roles.role_id", "employee_roles.role_id")
        .where("roles.role_id","!=",1)
        .orderBy('created_at', 'desc')
        .limit(limit || 10)
        .offset((page - 1) * (limit || 10))
        .execute()
        return data
    }
    //
    async countEmployees(){
        const data = await this.db.selectFrom('employees')
        .select(eb => eb.fn.count('employee_id').as('count'))
        .execute()
        return data
    }
    async getRoleByEmployee(id:number){
        const e_id = id
        const data = await this.db.selectFrom('employee_roles')
        .selectAll()
        .where('employee_id','=', e_id)
        .execute()
        return data
    }
    //
    async createEmployee(table:'employees' | 'employee_roles' | 'team_members',employee:DB['employees' | 'employee_roles' | 'team_members']) {
        const data = await this.db.insertInto(table)
        .values(employee)
        .execute()
        return data
    }
    async updateEmployee(id:number,employee:ValueType[]) {
        const data = updateDataByCondition(this.db,
          'employees',employee,
          {conditionName:'employee_id',conditionMethod:'=',value:id}
        )
        return data
    }
    async getEmployeesById(id: number) {
        const e_id = id
        const data = await this.db.selectFrom('employees')
        .select<any>((eb:any) =>[
          "employee_id","first_name","last_name","email","created_at",
          jsonArrayFrom(
            eb.selectFrom('employee_roles')
            .select(['role_id'])
            .whereRef('employees.employee_id', '=', 'employee_roles.employee_id')
          ).as('author'),
          jsonArrayFrom(
            eb.selectFrom('team_members')
            .select(['role'])
            .whereRef('employees.employee_id', '=', 'team_members.employee_id')
          ).as('role')
        ])
        .where('employee_id','=', e_id)
        .execute()
        return data    
    }
    async getTeams() {
        const data = await this.db.selectFrom('teams')
        .selectAll()
        .execute()
        return data
    }
    async createTeam(team:DB['teams'][]) {
        const data = await this.db.insertInto('teams')
        .values(team)
        .execute()
        return data
    }
    async updateTeam(id:number,team:ValueType[]) {
        const data = updateDataByCondition(this.db,
          'teams',team,
          {conditionName:'team_id',conditionMethod:'=',value:id}
        )
        return data
    }
    async getTeamMemberById(id: number) {
        const data = await this.db.selectFrom('team_members as tm')
        .select<any>(["tm.team_id","tm.employee_id","tm.role","e.first_name","e.last_name","e.email"])
        .where('tm.team_id', '=', id)
        .leftJoin('employees as e', 'e.employee_id', 'tm.employee_id')
        .execute()
        return data
    }
    async addTeamMember(team_member:DB['team_members']) {
        const data = await this.db.insertInto('team_members')
        .values(team_member)
        .execute()
        return data
    }
    
    async getLastIdEmploy() {
      const data = await this.db.selectFrom('employees')
      .select(eb => eb.fn.max('employee_id').as('last'))
      .execute()
      return data
    }
    async deleteFromEmployees(value:string[] | number[]){
      return await this.db.deleteFrom('employees')
      .where('employee_id'as any, 'in', value)
      .executeTakeFirst()
    }


    async deleteFromEmployeeRoles(value: number[] | string[]) {
       return await this.db.deleteFrom('employee_roles')
      .where('employee_id'as any, 'in', value)
      .executeTakeFirst()
    }

    async deleteFromTeamMembers(value: number[] | string[]) {
      return await this.db.deleteFrom('team_members')
      .where('employee_id'as any, 'in', value)
      .executeTakeFirst()
    }

}
