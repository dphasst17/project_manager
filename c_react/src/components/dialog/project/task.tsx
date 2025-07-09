import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { ExcelReader } from "@/libs/handle"
import { Input } from "@/components/ui/input"
import BtnExcel from "@/components/ui/btn_excel"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}  from "@/components/ui/select";
import {getToken} from "@/libs/cookie"
import {adminAppendDataProject} from "@/api/project"
import {toast} from "react-toastify"
const taskKey = ["name","description","deadline"]
const TaskDialog = ({id,memberData,closeDialog}:{id:number | string,memberData:any,closeDialog:() => void}) => {
  const [task,setTask] = useState<any>(null)
  const [file,setFile] = useState<any>(null)
  useEffect(() => {
    const readFile = async () => {
      if (file) {
        const result:any = await ExcelReader(file)
        const keyFromExcel = Object.keys(result[0])
        const checkKeyIsExist = keyFromExcel.every((d:string) => taskKey.includes(d))
        console.log(checkKeyIsExist)
        if(!checkKeyIsExist) return toast.error("Key of excel does not match")
        setTask(result.map((d:any) => ({task_name:d.name,description:d.description,due_date:d.deadline,assigned_to:""})))
      }
    }
    readFile()
  },[file])
  const handleAssignedTask = (index:number,id:number) => {
    task && setTask(
      task.map((d:any,i:number) => ({
        ...d,
        assigned_to:index === i ? id : d.assigned_to
      }))
    )
  }
  const handleChangeTask = (index:number,col:string,value:string) => {
    task && setTask(
      task.map((d:any,i:number) => ({
        ...d,
        [col]:index === i ? value : d[col]
      }))
    )
  }
  const handleUploadTask = async () => {
    const validateTask = task.filter((d:any) => d.task_name === "" || d.description === "" || d.due_date === "")
    if(validateTask.length > 0) return toast.error("Task name, description or deadline is required")
    const token = await getToken()
    const convertData = task.map((d:any) => ({
      project_id:id,
      task_name:d.task_name,
      description:d.description,
      due_date:d.due_date,
      assigned_to:d.assigned_to
    }))
    const res = token && await adminAppendDataProject(token,{type:"tasks",value:convertData})
    if(res.status !== 201) return toast.error("Failed to upload data")
    toast.success("Success to upload data")
    handleClose()
  }
  const handleClose = () => {
    setFile(null)
    setTask(null)
    closeDialog()
  }
  return <AlertDialogContent>
    <AlertDialogTitle>Budget</AlertDialogTitle>
    <div className="w-[80vw] h-[70dvh]">
       <div className="col-span-5">
            {!task && <BtnExcel setFile={setFile}/>}
          </div>
          <div className="col-span-5 flex flex-col gap-y-4">
            <div className="w-full grid grid-cols-5 gap-x-1 gap-y-4">
              <span>Task name</span>
              <span className="col-span-2">Description</span>
              <span>Deadline</span>
              <span>Assigned to</span>
            </div>
            {/**/}
            <div className="w-full h-[90%] overflow-y-auto grid grid-cols-5 gap-x-1 gap-y-4 p-1">
              {task && task.map((d:any,i:number) => <div key={i} className="col-span-5 grid grid-cols-5 gap-1">
                <Input onChange={(e) => handleChangeTask(i,"task_name",e.target.value)} 
                  defaultValue={d.task_name} placeholder="Task name" className="col-span-1" />
                <Input onChange={(e) => handleChangeTask(i,"description",e.target.value)}                  
                  defaultValue={d.description} placeholder="Description" className="col-span-2" />
                <Input onChange={(e) => handleChangeTask(i,"due_date",e.target.value)}                  
                  defaultValue={d.due_date} placeholder="Deadline" className="" />
                <div className="employee w-full">
                  <Select onValueChange={(v:any) => handleAssignedTask(i,v)}>
                    <SelectTrigger className="bg-zinc-700 border-none">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                     <SelectContent className="bg-zinc-700 border-none">          
                      {memberData && memberData
                        .map((d:any) => <SelectItem key={d.employee_id} 
                        value={d.employee_id}>{`${d.first_name} ${d.last_name} - ${d.role_in_project}`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>)}
            </div>
            {/**/}
          </div>
    </div>
    <AlertDialogFooter>
      <AlertDialogAction className="bg-blue-600 cursor-pointer" onClick={handleUploadTask}>Add</AlertDialogAction>
      <AlertDialogCancel className="bg-red-600 cursor-pointer border-none" onClick={handleClose}>Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default TaskDialog
