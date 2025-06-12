export interface Employees{
  employee_id:number;
  first_name:string;
  last_name:string;
  email:string;
  phone?:string
  avatar?:string;
  gender?:string;
  author:number;
  role:string;
  created_at:string;
}
export interface EmployeeRoles{
  employee_role_id:number;
  employee_id:number;
  role_id:number;
  created_at:string;
}
export interface Permissions{
  permission_id:number;
  permission_name:string;
  description:string;
}
export interface Teams{
  team_id:number;
  team_name:string;
  description:string;
  created_at:string;
}
export interface TeamMembers{
  team_member_id:number;
  team_id:number;
  employee_id:number;
  role:string;
  created_at:string;

}

