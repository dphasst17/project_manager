import { AlertDialogContent, AlertDialogFooter, AlertDialogTitle,AlertDialogCancel,AlertDialogAction } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { updateProject } from "@/api/project"
import {toast} from "react-toastify"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}  from "@/components/ui/select";
const TaskEditDialog = ({projectData,setProjectData,taskList,closeDialog}:
{projectData:any,setProjectData:any,taskList:number[],closeDialog:() => void}) => {
  const [data,setData] = useState<any>(null)
  useEffect(() => {
    projectData && setData(projectData.task.filter((d:any) => taskList.includes(d.task_id)))
  },[projectData,taskList])
  const handleChangeTask = (id:number,col:string,newValue:any) => {
    setData(
      data.map((d:any) => ({
        ...d,
        [col]: d.task_id === id ? newValue : d[col]
      }))
    )
  }
  const handleUpdateTask = async() => {
    const key = Object.keys(data[0])
    const newTask = data.map((d:any)=> ({task_id:d.task_id,task_name:d.task_name,description:d.description,due_date:d.due_date,status:d.status}))
    const currentTask = projectData.task.map((d:any) => ({task_id:d.task_id,task_name:d.task_name,description:d.description,due_date:d.due_date,status:d.status}))
    const getObjectChange = newTask.filter((d:any) => key.some((k:string) => d[k] !== currentTask.find((f:any) => f.task_id === d.task_id)[k]))
    if(getObjectChange.length === 0) return
    const condition={
      name:"task_id",
      method:"=" as '=',
      value:getObjectChange.flatMap((d:any) => d.task_id)
    }

    const valueUpdate = getObjectChange.map((d:any) => {
      const obj:any = {}
      Object.keys(d).map((k:string) => {
        if(d[k] !== currentTask.find((f:any) => f.task_id === d.task_id)[k]) {
          obj[k] = d[k]
        }
      })
      return obj
    })
    const res = await updateProject('tasks',valueUpdate,condition)
    if(res.status !== 200) return toast.error("Failed to update task")
    toast.success("Success to update task")
    setProjectData({
      ...projectData,
      task: projectData.task.map((d:any) => {
        return {
          ...d,
          ...getObjectChange.find((f:any) => f.task_id === d.task_id)
        }
      })
    })
    handleClose()
  }
  const handleClose = () => {
    
    closeDialog()
  }
  return <AlertDialogContent>
    <AlertDialogTitle>Update Task In Project</AlertDialogTitle>
    <div className="w-[70vw]">
      <div className="w-full">
        {data && data.map((d:any) => <div key={d.task_id} className="w-full grid grid-cols-5 gap-2 my-2">
            <Input defaultValue={d.task_name} onChange={(e) => handleChangeTask(d.task_id,"task_name",e.target.value)}/>
            <Input defaultValue={d.description} onChange={(e) => handleChangeTask(d.task_id,"description",e.target.value)} className="col-span-2"/>
            <Input defaultValue={d.due_date} onChange={(e) => handleChangeTask(d.task_id,"due_date",e.target.value)} type="date"/>
            <Select value={d.status} onValueChange={(e) => handleChangeTask(d.task_id,"status",e)}>
              <SelectTrigger className="bg-zinc-700 border-none text-white">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 border-none text-white">          
               <SelectItem value="not_started">Not Started</SelectItem>
               <SelectItem value="in_progress">In Progress</SelectItem>
               <SelectItem value="review">Review</SelectItem>
               <SelectItem value="completed">Completed</SelectItem>
               <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div> 
    </div> 
  <AlertDialogFooter>
      <AlertDialogAction onClick={(e) => {e.preventDefault();handleUpdateTask()}} className="bg-blue-600 cursor-pointer">Save</AlertDialogAction>
      <AlertDialogCancel onClick={(e) => {e.preventDefault();handleClose()}} className="bg-red-600 cursor-pointer border-none">
        Cancel
      </AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default TaskEditDialog

