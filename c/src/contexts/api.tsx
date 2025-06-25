'use client'
import { createContext, use, useEffect, useState } from "react";
import { getToken } from "@/lib/cookie";
import { useMutation } from '@tanstack/react-query'
import {AppContext} from './app'
import { getInfo, adminGetAllEmployee, adminGetTeam } from '@/api/employee'
import { adminGetProjects, getProjectByEmployee, adminGetAllTask, getTaskByStatus} from '@/api/project'
import { useEmployeeStore } from "@/stores/employee";
import { useTaskStore } from "@/stores/task";
import { useProjectStore } from "@/stores/project";
import {adminGetAll, getByEmployee} from "@/api/chat";

export const ApiContext = createContext<any>({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPending,setIsPending] = useState(true)
    const {isLog,setChannel} = use(AppContext);
    const {employee,setEmployee,setAdminEmployee,setTeam} = useEmployeeStore();
    const {setTask,setStatusTask} = useTaskStore();
    const {setProject,setEmployeeProject} = useProjectStore();
    const mutationInfo = useMutation({
        mutationFn: async (token:string) => {
          const res = await getInfo(token)
          return res
        },
        onSuccess: (data) => {
          data.status === 200 && setEmployee(data.data[0])
        },
        onError: (error) => {
          console.log(error)
        }
    });
    const mutationEmployee = useMutation({
      mutationFn: async (token:string) => {
        const [project,completed_task,in_progress_task,not_started_task,chat] = await Promise.all([
          getProjectByEmployee(token,1,10),
          getTaskByStatus('employee',token,'completed',1,12),
          getTaskByStatus('employee',token,'in_progress',1,12),
          getTaskByStatus('employee',token,'not_started',1,12),
          getByEmployee(token,20,0)
        ])
        return {project,completed_task,in_progress_task,not_started_task,chat}
      },
      onSuccess: (data) => {
        const {project,completed_task,in_progress_task,not_started_task,chat} = data
        chat.status === 200 && setChannel(chat.data)
        project.status === 200 && (setEmployeeProject(project.data))
        completed_task.status === 200 && in_progress_task.status === 200 && not_started_task.status === 200 
        && setStatusTask({completed:completed_task.data,in_progress:in_progress_task.data,not_started:not_started_task.data})
      },
      onError: (error) => {
        console.log(error)
      }
    })
    const mutationAdmin = useMutation({
      mutationFn: async (token:string) => {
        const [project,team,task,employee,chat] = await Promise.all([
          adminGetProjects(token,1,10),
          adminGetTeam(token),
          adminGetAllTask(token,1,12),
          adminGetAllEmployee(token,1,15),
          adminGetAll(token,20,0)
        ])
        return {project,team,task,employee,chat}
      },
      onSuccess: (data) => {
        data.chat.status === 200 && setChannel(data.chat.data)
        data.project.status === 200 && setProject(data.project.data)
        data.team.status === 200 && setTeam(data.team.data)
        data.task.status === 200 && setTask(data.task.data)
        data.employee.status === 200 && setAdminEmployee(data.employee.data)
      },
      onError: (error) => {
        console.log(error)
      }
    })
    useEffect(() => {
      if(isLog){
        setIsPending(true)
        const getData = async () => {
          const token = await getToken();
          if (token) {
            mutationInfo.mutate(token)
          }
        }
        getData()
      }else{
        setIsPending(false)
      }
    },[isLog])
    useEffect(() => {
      if(isLog && employee){
      const getData = async () => {
          const token = await getToken();
          if (token) {
            employee.author == Number(process.env.NEXT_PUBLIC_IS_ADMIN) ? mutationAdmin.mutate(token) : mutationEmployee.mutate(token)
          }
          setIsPending(false)
        }
        getData()
      }
         },[isLog,employee])
    return (
        <ApiContext.Provider value={{isPending}}>
            {children}
        </ApiContext.Provider>
    )
}

