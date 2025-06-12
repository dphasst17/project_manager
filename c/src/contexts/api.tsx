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

export const ApiContext = createContext<any>({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPending,setIsPending] = useState(true)
    const {isLog} = use(AppContext);
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
        const project = await getProjectByEmployee(token,1,10)
        const completed_task = await getTaskByStatus('employee',token,'completed',1,12)
        const in_progress_task = await getTaskByStatus('employee',token,'in_progress',1,12)
        const not_started_task = await getTaskByStatus('employee',token,'not_started',1,12)
        return {project,completed_task,in_progress_task,not_started_task}
      },
      onSuccess: (data) => {
        const {project,completed_task,in_progress_task,not_started_task} = data
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
        const project = await adminGetProjects(token,1,10)
        const team = await adminGetTeam(token)
        const task = await adminGetAllTask(token,1,12)
        const employee = await adminGetAllEmployee(token,1,15)
        return {project,team,task,employee}
      },
      onSuccess: (data) => {
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
            mutationEmployee.mutate(token)
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
            employee.author == 1 && mutationAdmin.mutate(token)
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

