export interface Auth{
  auth_id: number,
  employee_id: number,
  username:string,
  password_hash:string,
  last_login:Date
  failed_login_attempts:number,
  is_locked:number,
  created_at:Date
}
export interface SignIn{
  auth:{
    username:string,
    password:string,
    created_at:Date
  },
  employee:{
    first_name:string,
    last_name:string,
    email:string,
    created_at:Date
  },
  role:{
    role_id:string,
    created_at:Date
  },
  team:{
    team_id:string,
    role:string,
    joined_at:Date
  }
}
export interface DB{
  auth:Auth
}
