'use client'
import {useTaskStore} from "@/stores/task"
import CardMac from "@/components/ui/card_mac"
import * as ct from "@/constants/constants"
import {updateProject} from "@/api/project"
import {toast} from "react-toastify"
const NotStartedTask = () => {
const {statusTask,setStatusTask} = useTaskStore()
  const statusList = [
      {
        current:'not_started',
        next:'in_progress',
        value:"Start"
      },
      {
        current:'in_progress',
        next:'completed',
        value:"Finish"
      }
    ]

  const handleChangeStatus = async (id:number,current:string) => {
    const next = statusList.filter((s) => s.current === current)[0].next
    const data = [{
      status:next
    }]
    const condition={
      name:'task_id',
      value:id
    }
    const res = await updateProject('tasks',data,condition)
    if(res.status !== 200) return toast.error("Server Error, Please Try Again")
    toast.success("Update Success")
    const result = statusTask?.not_started.data.filter((item:any) => item.task_id === id).map((item) => {
      return {
        ...item,
        status:next
      }      
    })
    statusTask && setStatusTask({
      ...statusTask,
      in_progress: {
        ...statusTask.in_progress,
        data: [...statusTask.in_progress.data,...result!]
      },
      not_started: {
        ...statusTask.not_started,
        data: statusTask.not_started.data.filter((item:any) => item.task_id !== id)
      }
    })

  }
 return statusTask && <div className="not_started-task w-full min-h-[200px] flex flex-col items-center">
    <h1 className="text-2xl font-semibold">Not Started</h1>
    <div className="w-4/5 grid grid-cols-4 gap-2">
      {statusTask?.not_started.data.map((item:any) => 
      <div key={item.task_id}>
       <CardMac title={item.task_name} description={item.description}
        tag={
          [
            item.due_date.split('T')[0].split("-").reverse().join("/"),
            ct[item.status as keyof typeof ct]
          ]
        }
        key={item.task_id} />
        <div className="mt-2 h-[25px]">
          <button className="w-30 h-8 bg-zinc-950 border border-blue-500 hover:scale-[1.1] hover:bg-blue-500 transition-all cursor-pointer rounded-md" onClick={() => handleChangeStatus(item.task_id,item.status)}>
            {statusList.find((s) => s.current === item.status)?.value}
          </button>
        </div>
      </div>)}
    </div>
  </div>}
export default NotStartedTask

