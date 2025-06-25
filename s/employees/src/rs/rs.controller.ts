import { Controller } from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import { RsService } from './rs.service';
//@ts-ignore
import {ValueType} from 'utils/query_custom';

@Controller('')
export class RsController {
    constructor(private readonly rsService: RsService) { }
    @EventPattern('info')
    async getEmployeeInfo(id: number) {
        return this.rsService.getEmployeeInfo(id)
    }
    @EventPattern('getEmployees')
    async getEmployees(data:{page: number, limit: number}) {
        const {page,limit} = data
        return this.rsService.getEmployees(page, limit)
    }
    @EventPattern('getRoleByEmployee')
    async getRoleByEmployee(data:{id:number}) {
        return this.rsService.getRoleByEmployee(data.id)
    }
    @EventPattern('getEmployeesById')
    async getEmployeesById(id:number) {
        return this.rsService.getEmployeesById(id)
    }
    @EventPattern('getTeams')
    async getTeams() {
        return this.rsService.getTeams()
    }
    @EventPattern('getTeamMemberById')
    async getTeamMemberById( data:{id:number}) {
        const id = data.id
        return this.rsService.getTeamMemberById(id)
    }
    @EventPattern('addTeamMember')
    async addTeamMember(team_member:any) {
        return this.rsService.addTeamMember(team_member)
    }
    @EventPattern('createEmployee')
    async createEmployee(data:{table:'employees' | 'employee_roles' | 'team_members',employee:any}) {
        const {table,employee} = data
        return this.rsService.createEmployee(table,employee)
    }
    @EventPattern('updateEmployee')
    async updateEmployee(data:{id:number,employee:ValueType[]}) {
        const {id,employee} = data
        return this.rsService.updateEmployee(id,employee)
    }
    @EventPattern('createTeam')
    async createTeam(team:any) {
        return this.rsService.createTeam(team)
    }
    @EventPattern('updateTeam')
    async updateTeam(data:{id:number,team:ValueType[]}) {
        const {id,team} = data
        return this.rsService.updateTeam(id,team)
    }
    @EventPattern('deleteFromEmployees')
    async deleteFromEmployees(data:{table:'employees' | 'employee_roles' | 'team_members',value: number[]}) {
        const {table,value} = data
        return this.rsService.deleteFromEmployees(table,value)
    }
    @EventPattern('getLastIdEmploy')
    async getLastIdEmploy() {
        return this.rsService.getLastIdEmploy()
    }
}
