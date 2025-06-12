import { Injectable, Inject } from '@nestjs/common';
import { RsRepo } from './rs.repo';
import { Projects,ProjectAssignments,Tasks, Budgets } from 'src/@types/rs.types';
import {firstValueFrom} from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
//@ts-ignore
import { formatDate, formatTime } from 'utils/handle';
@Injectable()
export class RsService {
    constructor(
      @Inject('NATS_SERVICE') private natsClient: ClientProxy,
      private readonly rsRepo: RsRepo
    ) { }
    private async updateStatus(){
      await this.rsRepo.updateData('projects',{status:'in_progress'}, {
        name:'status',
        value:'planning'
      },{
        name:'start_date',
        method: '<=',
        value:new Date().toISOString().split('T')[0]
      })
      await this.rsRepo.updateData('tasks',{status:'overdue'}, {
        name:'status',
        value:'in_progress'
      },{
        name:'due_date',
        method: '<',
        value:new Date().toISOString().split('T')[0]
      }
      )
    }
    async getProjects(page: number, limit: number) {
      const count = await this.rsRepo.countProjects()
      const result =  await this.rsRepo.getProjects(page,limit)
      await this.updateStatus()
      return {
        total: count[0].count,
        limit: limit,
        page: page,
        data: result
      }
    }
    async getAllTasks(page: number, limit: number) {
      const count = await this.rsRepo.countTasks()
      const result =  await this.rsRepo.getAllTasks(page,limit)
      const result_data = await Promise.all(result.map(async (item:any) => {
      const dataEmployee = await firstValueFrom(this.natsClient.send('getEmployeesById',item.assigned_to))
       return {...item,employee:dataEmployee.data[0]}
      }))
      const total = Number(count[0].count)
      const totalPage = Math.ceil(total/ limit)

      return {
        total,
        limit,
        page,
        totalPage,
        data: result_data
      }
    }
    async getDetailProject(id: number) {
      const result:any =  await this.rsRepo.getDetailProject(id)
      const getEmployeeData = await Promise.all(result[0].member.map(async (item:any) => {
        const dataEmployee = await firstValueFrom(this.natsClient.send('getEmployeesById',item.employee_id))
        return dataEmployee.data[0]
      }))
      return [{
        ...result[0],
        member: result[0].member.map((item:any) => {
          const filterData = getEmployeeData.filter((data) => data.employee_id === item.employee_id)
          return {...item,
          first_name:filterData[0].first_name,
          last_name:filterData[0].last_name,
          email:filterData[0].email
          }
        })
      }]
    }
    //create project
    async createProject(project:Projects,assignment:ProjectAssignments[],task:Tasks[],budget:Budgets[]) {
      const date = new Date()
      const convertDate = `${formatDate(date)} ${formatTime(date)}`
      const projectData = {
        ...project,
        created_at: convertDate
      }
      const insertProject = await this.rsRepo.createData('projects',projectData)
      if(!insertProject){
        return {status:500,message:'Server Error, Please Try Again'}
      }

      const deleteData = async () => {
        await Promise.all([
          this.rsRepo.deleteData('tasks',Number(insertProject.insertId)),
          this.rsRepo.deleteData('project_assignments',Number(insertProject.insertId)),
          this.rsRepo.deleteData('budgets',Number(insertProject.insertId))
        ])

      }

      try{
        const convertAssignment = assignment.map((item) => {
          return {
            ...item,
            project_id: Number(insertProject.insertId),
            assigned_at: convertDate
          }          
        })  

        const convertTask = task.map((item) => {
          return {
            ...item,
            created_at: convertDate,
            project_id: Number(insertProject.insertId)
          }
        })
        const convertBudget = budget.map((item) => {
          return {
            ...item,
            project_id: Number(insertProject.insertId),
            created_at: convertDate
          }
        })
        const [insertAssignment,insertTask] = await Promise.all([
          this.rsRepo.createData('project_assignments',convertAssignment),
          this.rsRepo.createData('tasks',convertTask),
          this.rsRepo.createData('budgets',convertBudget)
        ])
        if(!insertAssignment || !insertTask){
          await deleteData()
          await this.rsRepo.deleteData('projects',Number(insertProject.insertId))
          return {status:500,message:'Server Error, Please Try Again'}
        }
        return {status:201,data:{project_id:Number(insertProject.insertId)}}
      }
      catch(e){
        await deleteData()
        await this.rsRepo.deleteData('projects',Number(insertProject.insertId))
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    async appendDataToProject(data:{type:'project_assignments' | 'tasks' | 'budgets',value:any}){
      try{
        await this.rsRepo.createData(data.type,data.value)
        return 'Append data success'
      }
      catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    async getTaskByStatus(page: number, limit: number,status:'in_progress' | 'not_started' | 'completed',id?:number) {
      const {total,data} =  await this.rsRepo.getTaskByStatus(page,limit,status,id)
      const totalPage = Math.ceil(total/ limit)
      return {
        total,
        limit,
        page,
        totalPage,
        data
      }
    }
    async getTaskByEmployee(id:number,limit:number,page:number){
      const count = await this.rsRepo.countTasks(id)
      const result =  await this.rsRepo.getTaskByEmployee(id,limit,page)
      const total = Number(count[0].count)
      const totalPage = Math.ceil(total/ limit)
      return {
        total,
        limit,
        page,
        totalPage,
        task:result.map((item:any) => ({
          task_id:item.task_id,
          task_name:item.task_name,
          description:item.description,
          created_at:item.created_at,
          assigned_to:item.assigned_to,
          due_date:item.due_date,
          status:item.status
        }))
      }
    }
    async getProjectByEmployee(id:number,limit:number,page:number){
      const total = await this.rsRepo.countProjectByEmployee(id)
      const result =  await this.rsRepo.getProjectByEmployee(id,limit,page)
      await this.updateStatus()
      return {
        total: total[0].count,
        limit: limit,
        page: page,
        data: result.flatMap((item:any) => item.project)
      }
    }
    async updateProject(
      type:"projects" | "assignment" | "tasks" | "budgets",
      data:any[],
      condition:{
        name:string,
        method?:'=' | '!=' | '<' | '<=' | '>' | '>=' | 'like' | 'in'
        value:any
      }
    ){
      const query = data.map((item,index:number) => {
        const newCondition = {
          name:condition.name,
          method:condition.method,
          value:typeof condition.value === 'object' ? condition.value[index] : condition.value
        }
        this.rsRepo.updateData(type, item, newCondition)
      })
      const result = await Promise.all(query)
      return result ? {message:'Update Success'} : {message:'Server Error, Please Try Again'}
    }
    
        
}
