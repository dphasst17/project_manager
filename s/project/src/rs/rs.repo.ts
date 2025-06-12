import { Injectable } from '@nestjs/common';
import { InjectKysely } from "nestjs-kysely";
import { Kysely, sql } from "kysely";
import { jsonArrayFrom} from "kysely/helpers/mysql";
import { DB } from 'src/@types/rs.types';
@Injectable()
export class RsRepo {
    constructor(@InjectKysely() private readonly projects: Kysely<DB>) {}
    async countProjects(){
     const data = await this.projects.selectFrom('projects')
     .select(eb => eb.fn.count('project_id').as('count'))
     .execute()
     return data
    }
    async countProjectByEmployee(id:number){
      const query = this.projects.selectFrom('project_assignments')
      .select(eb => eb.fn.count('project_id').as('count'))
      const data = await query.where('employee_id', '=', id).execute()      
      return data 
    }
    async countTasks(id?:number){
      const query = this.projects.selectFrom('tasks')
      .select(eb => eb.fn.count('task_id').as('count'))
      const data = id ? await query.where('assigned_to', '=', id).execute() : await query.execute()
      return data
    }
    async getProjects(page: number, limit: number) {
      const data = await this.projects.selectFrom('projects')
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(limit || 10)
      .offset((page - 1) * (limit || 10))
      .execute()
      return data
    }
    async getAllTasks(page: number, limit: number) {
      const data = await this.projects.selectFrom('tasks')
      .select<any>(['task_id','task_name','description','created_at','assigned_to','due_date','status'])
      .orderBy(sql`FIELD(status, 'in_progress', 'not_started', 'completed')`)
      .orderBy('due_date', 'desc')
      .limit(limit || 10)
      .offset((page - 1) * (limit || 10))
      .execute()
      return data
    }
    async getDetailProject(id: number) {
      const data = await this.projects.selectFrom('projects')
      .select<any>((eb:any) => [
        "projects.project_id","projects.project_name","projects.description","projects.start_date","projects.end_date",
        jsonArrayFrom(
          eb.selectFrom('tasks')
          .select(['task_id','task_name','description','created_at','assigned_to','due_date','status'])
          .whereRef('projects.project_id', '=', 'tasks.project_id')
        ).as('task'),
        jsonArrayFrom(
          eb.selectFrom('project_assignments')
          .select(['project_id','employee_id','role_in_project','assigned_at'])
          .whereRef('projects.project_id', '=', 'project_assignments.project_id')
        ).as('member'),
        jsonArrayFrom(
          eb.selectFrom('budgets')
          .select(['budget_id','project_id','total_budget','spent_amount','category','created_at'])
          .whereRef('projects.project_id', '=', 'budgets.project_id')
        ).as('budgets')
      ])
      .where('project_id', '=', id)
      .execute()
      return data
    }

    async getTaskByStatus(page: number, limit: number,status:'in_progress' | 'not_started' | 'completed',id?:number) {
      const date = (new Date()).toISOString().split("T")[0]
      //count data by status match
      const count = id ? this.projects.selectFrom('tasks')
      .select(eb => eb.fn.count('task_id').as('count'))
      .where('assigned_to', '=', id)
      : this.projects.selectFrom('tasks')
      .select(eb => eb.fn.count('task_id').as('count'))
      const total = await count.where('status', '=', status).execute()

      //query data
      const query = id ? this.projects.selectFrom('tasks')
      .select<any>(['task_id','task_name','tasks.description','tasks.created_at','assigned_to','due_date','tasks.status'])
      .leftJoin("projects as p","p.project_id","tasks.project_id")
      .where('assigned_to', '=', id)
      .where('p.start_date', '<=', date)
      : this.projects.selectFrom('tasks')
      .select<any>(['task_id','task_name','description','created_at','assigned_to','due_date','status'])
      .leftJoin("projects as p","p.project_id","tasks.project_id")

      const data = await query.where('tasks.status', '=', status)
      .orderBy('created_at', 'desc')
      .limit(limit || 10)
      .offset((page - 1) * (limit || 10))
      .execute()
      return {
        total: Number(total[0].count),
        data
      }
    }

    async getTaskByEmployee(id:number,limit:number,page:number) {
      const data = await this.projects.selectFrom('tasks')
      .select<any>([
        'task_id','task_name','description','created_at','assigned_to','due_date','status'
      ])
      .where('assigned_to', '=', id)
      .orderBy(sql`FIELD(status, 'in_progress', 'not_started', 'completed')`)
      .limit(limit || 10)
      .offset((page - 1) * (limit || 10))
      .execute()
      return data
    }
    async getProjectByEmployee(id:number,limit:number,page:number){
      const data = await this.projects.selectFrom('project_assignments')
      .select<any>((eb:any) => [
        'assignment_id','employee_id','role_in_project','assigned_at',
        jsonArrayFrom(
          eb.selectFrom('projects')
          .select(['project_id','project_name','created_at','description','start_date','end_date'])
          .whereRef('project_assignments.project_id', '=', 'projects.project_id')
        ).as('project')
      ])
      .where('employee_id', '=', id)
      .limit(limit || 10)
      .offset((page - 1) * (limit || 10))
      .execute()
      return data
    }
    async createData(table:'projects' | 'project_assignments' | 'tasks' | 'budgets', data:any) {
      const result = await this.projects.insertInto(table)
      .values(data)
      .executeTakeFirst()
      return result
    }
    async updateData(table: 'projects' | 'assignment' | 'tasks' | 'budgets', data: any,
      conditionData:{name:string,method?:'=' | '!=' | '<' | '<=' | '>' | '>=' | 'like' | 'in',value:string | number},
      conditioRef?:{name:string,method?:'=' | '!=' | '<' | '<=' | '>' | '>=' | 'like' | 'in',value:string | number}
    ) {
      let query:any;
      if(table === "projects"){
        query = this.projects.updateTable('projects')
      }else if(table === "assignment"){
        query = this.projects.updateTable('project_assignments')
      }else if(table === "budgets"){
        query = this.projects.updateTable('budgets')
      }else{
        query = this.projects.updateTable('tasks')
      }
      const resultQuery = conditioRef ? query.where(conditioRef.name,conditioRef.method || '=',conditioRef.value) : query
      return await resultQuery
        .set(data)
        .where(conditionData.name, conditionData.method || '=', conditionData.value)
        .execute();
    }

    async deleteData(table: 'projects' | 'project_assignments' | 'tasks' | 'budgets', id: number) {
      let query:any;
      let condition:any;
      if (table === 'projects') {
        query = this.projects.deleteFrom('projects')
        condition = 'project_id'
      } else if (table === 'project_assignments') {
        query = this.projects.deleteFrom('project_assignments')
        condition = 'assignment_id'
      } else if (table === 'budgets') {
        query = this.projects.deleteFrom('budgets')
        condition = 'budget_id'
      } else {
        query = this.projects.deleteFrom('tasks')
        condition = 'task_id'
      }
      // 'tasks'
      return await query
        .where(condition, '=', id)
        .execute();
    }
}
