import { Controller } from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import { RsService } from './rs.service';
import { Projects,ProjectAssignments,Tasks, Budgets } from 'src/@types/rs.types';
@Controller()
export class RsController {
    constructor(private readonly rsService: RsService) { }
    @EventPattern('getProjects')
    async getProjects(data:{limit:number,page:number}) {
      try{
        const result = await this.rsService.getProjects(data.page,data.limit)
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('getAllTasks')
    async getAllTasks(data:{limit:number,page:number}) {
      try{
        const result = await this.rsService.getAllTasks(data.page,data.limit)
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('getDetailProject')
    async getDetailProject(data:{id:number}) {
      try{
        const result = await this.rsService.getDetailProject(data.id)
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('createProject')
    async createProject(data:{project:Projects,assignment:ProjectAssignments[],task:Tasks[],budget:Budgets[]}) {
      try{
        const result = await this.rsService.createProject(data.project,data.assignment,data.task,data.budget)
        return result
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('append')
    async append(data:{type:"project_assignments" | "tasks" | "budgets",value:any}) {
      try{
        const result = await this.rsService.appendDataToProject(data)
        return {status:201,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('getTaskByStatus')
    async getTaskByStatus(data:{page: number, limit: number,status:'in_progress' | 'not_started' | 'completed',id?:number}) {
      try{
        const result = await this.rsService.getTaskByStatus(data.page,data.limit,data.status,data.id)
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('getTaskByEmployee')
    async getTaskByEmployee(data:{id:number,limit:number,page:number}) {
      try{
        const result = await this.rsService.getTaskByEmployee(data.id,data.limit,data.page)
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('getProjectByEmployee')
    async getProjectByEmployee(data:{id:number,limit:number,page:number}) {
      try{
        const result = await this.rsService.getProjectByEmployee(data.id,data.limit,data.page)
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('updateProject')
    async updateProject(data:{type:"projects" | "assignment" | "tasks" | "budgets",data:any,condition:{name:string,value:string | number}}) {
      try{
        const result = await this.rsService.updateProject(data.type,data.data,data.condition)
        return {status:200,...result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }

}
