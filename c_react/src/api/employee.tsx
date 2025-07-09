const adminGetAllEmployee = async (token:string,page: number, limit: number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees?page=${page || 1}&limit=${limit || 10}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminCreateEmployee = async (data:any) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const adminUpdateEmployee = async (data:any) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const getInfo = async (token:string) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees/info`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminGetEmployeeById = async (token:string,id:number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees/${id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminCreateTeam = async (token:string,data:{team_name:string,description:string}[]) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees/team`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const adminGetTeam = async (token:string) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees/team`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminGetTeamMember = async (token:string,id:number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees/team/member/${id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminGetTeamMemberById = async (token:string,id:number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/employees/team/member/${id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
export {
  adminGetAllEmployee,adminCreateEmployee,adminUpdateEmployee,adminCreateTeam,
  getInfo,adminGetEmployeeById,adminGetTeam
  ,adminGetTeamMember,adminGetTeamMemberById
}

