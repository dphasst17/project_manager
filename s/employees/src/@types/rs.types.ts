export interface Employees{
  employee_id:number;
  first_name:string;
  last_name:string;
  email:string;
  phone?:string
  avatar?:string;
  gender?:string;
  ip_address?:string;
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
  employees:Employees;
  employee_roles:EmployeeRoles;
  permissions:Permissions;
  teams:Teams;
  team_members:TeamMembers;
  roles:Roles;
  role_permissions:RolePermissions
}
