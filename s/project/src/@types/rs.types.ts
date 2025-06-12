export interface Projects{
  project_id: number;
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  created_at: string;
  task?:any,
  member?:any
}
export interface Tasks{
  task_id?: number;
  task_name: string;
  description: string;
  assigned_to: number;
  due_to: string;
  status: 'not_started' | 'in_progress' | 'review' | 'completed' | 'overdue';
  created_at?: string;
  project_id?: number;
}
export interface ProjectAssignments{
  assignment_id:number;
  project_id?:number;
  employee_id:number;
  role_in_project:string;
  assigned_at:string
}
export interface Budgets{
  budget_id?:number;
  project_id?:number;
  total_budget:number;
  spent_amount:number;
  category:string;
  created_at?:string
}
export interface Roles{
  role_id:number;
  role_name:string;
  description:string;
}
export interface RolePermissions{
  role_permission_id:number;
  role_id:number;
  permission_id:number;
}

export interface DB{
  projects:Projects,
  project_assignments:ProjectAssignments,
  tasks:Tasks,
  budgets:Budgets,
  roles:Roles,
  role_permissions:RolePermissions
}

