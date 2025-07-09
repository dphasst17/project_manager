const adminGetProjects = async (token:string,page: number, limit: number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project?page=${page || 1}&limit=${limit || 10}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminGetAllTask = async (token:string,page: number, limit: number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/task?page=${page || 1}&limit=${limit || 10}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminAppendDataProject = async(token:string,data:{type:"project_assignments" | "tasks" | "budgets",value:any}) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/append`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const getTaskByStatus = async (type:'admin' | 'employee',token:string,
  status:'in_progress' | 'not_started' | 'overdue' | 'review' | 'completed',
  page: number, limit: number) => {
  const url = type === 'admin' ? `/status` : `/employee/status`
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/task${url}?status=${status}&page=${page || 1}&limit=${limit || 10}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}

const getProjectDetail = async(id:number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/detail/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}
const getProjectByEmployee = async (token:string,page: number, limit: number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/employee?page=${page || 1}&limit=${limit || 10}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const getTaskByEmployee = async (token:string,page: number, limit: number) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/task/employee?page=${page || 1}&limit=${limit || 10}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const adminCreateProject = async (token:string,data:{project:any,assignment:any,task:any}) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const adminCreateTask = async (data:any) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/task`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const updateProject = async(
  type: 'project' | 'assignment' | 'tasks' | 'budgets',
  data:any,
  condition:{name:string,method?:'=' | '!=' | '<' | '<=' | '>' | '>=' | 'like' | 'in',value:any}
) =>{
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      data,
      condition
    })
  })
  return res.json()
}
const createTasks = async (data:any) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/project/task`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

export {
  adminGetProjects,
  adminGetAllTask,
  adminAppendDataProject,
  getTaskByStatus,
  getProjectDetail,
  getProjectByEmployee,
  getTaskByEmployee,
  adminCreateProject,
  adminCreateTask,
  updateProject,
  createTasks
}

