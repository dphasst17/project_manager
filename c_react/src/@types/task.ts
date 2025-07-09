import type {Employees} from "@/@types/employee"

export interface Tasks{
  task_id:number,
  project_id:number
  task_name:string
  description:string
  assigned_to:number
  due_date:string
  created_at:string
}
export interface AdminTask extends Tasks{
  employee:Employees
}

