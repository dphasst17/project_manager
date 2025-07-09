import { useState,use } from "react"
import { AppContext } from "@/contexts/app"
import BtnDialog from "@/components/ui/btn_dialog"
import TaskDialog from "@/components/dialog/project/task"
import { formatDate } from "@/libs/handle"
import TaskEditDialog from "@/components/dialog/project/task_edit"
const TaskOverview = ({id,projectData,setProjectData,isOpen,setIsOpen}:{id:any,projectData:any,setProjectData:any,isOpen:any,setIsOpen:any}) => {
  const {isAdmin,isManager} = use(AppContext)
  const [taskEdit,setTaskEdit] = useState<number[]>([])
  const colorStatus = (status:string) => {
    if (status === "completed") {
      return "bg-emerald-500"
    }else if (status === "in_progress") {
      return "bg-amber-500"
    }else if(status === "review"){
      return "bg-sky-500"
    }else if(status === "not_started"){
      return "bg-slate-500"
    }else{
      return "bg-red-400"
    }
  }
   const handleSelectData = (id:number) => {
    const checkIdIsExist = taskEdit.includes(id)
    if (checkIdIsExist) {
      setTaskEdit(taskEdit?.filter((d) => d !== id))
    }else{
      setTaskEdit([...taskEdit,id]) 
    }
  }
  return <div className="task_overview col-span-9 h-full">
        <div className="w-full h-15 flex items-center justify-between my-2">
          <span className="text-xl font-semibold">Task Overview</span>
          {isAdmin && <BtnDialog title="+ Add Task" isOpen={isOpen.task as boolean} openChange={() => setIsOpen({...isOpen,task:!isOpen.task})}
            btnClass="text-blue-500 cursor-pointer" Component={TaskDialog} props={{id,memberData:projectData && projectData.member}}/>}
          {(isManager && taskEdit.length > 0) && <BtnDialog title="Edit" isOpen={isOpen.task as boolean} 
            openChange={() => setIsOpen({...isOpen,task:!isOpen.task})}
            btnClass="text-blue-500 cursor-pointer" Component={TaskEditDialog} 
            props={{projectData:projectData,setProjectData,taskList:taskEdit,
            closeDialog:() => setIsOpen({...isOpen,task:false})}}/>}
        </div>
        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="grid grid-cols-10 gap-y-2">
             <p className="col-span-6 font-semibold">Total Task</p>
             <p className="font-semibold">{projectData && projectData.task.length}</p>
          </div>
          <div className="grid grid-cols-10 gap-y-2">
             <p className="col-span-6 font-semibold">Completed Task</p>
             <p className="font-semibold">{projectData && projectData.task.filter((d:any) => d.status === "completed").length}</p>
          </div>
          <div className="grid grid-cols-10 gap-y-2">
             <p className="col-span-6 font-semibold">Pending Task</p>
             <p className="font-semibold">{projectData && projectData.task.filter((d:any) => d.status === "not_started").length}</p>
          </div>
        </div>
        <div className="h-auto grid grid-cols-3 gap-2 content-start">
          {projectData && projectData.task.map((d:any,index:number) => (
            <div key={index} onClick={() => handleSelectData(d.task_id)} 
              className={`cursor-pointer h-15 ${taskEdit.includes(d.task_id) && "border border-blue-500 border-solid"} shadow-md bg-zinc-900 text-white rounded-md p-2 grid grid-cols-8`}>
              <p className="text-center font-semibold col-span-8">{d.task_name}</p>
              <p className={`col-span-2 flex items-center justify-center text-[13px] rounded-md font-semibold ${colorStatus(d.status)}`}>
                {d.status}
              </p>
              <p className="col-span-3 text-center rounded-md font-semibold">Due: {formatDate(d.due_date)}</p>
              <p className="col-span-3 text-center rounded-md font-semibold">
              {projectData && projectData.member.filter((m:any) => m.employee_id === d.assigned_to)[0].first_name} 
              {projectData && projectData.member.filter((m:any) => m.employee_id === d.assigned_to)[0].last_name}
              </p>
            </div>
           ))}
        </div>
  </div>
}
export default TaskOverview
