import { AlertDialogContent, AlertDialogFooter, AlertDialogTitle,AlertDialogAction,AlertDialogCancel } from "@/components/ui/alert-dialog"
import BtnExcel from "../btn_excel"
import { useState, useEffect } from "react"
import { ExcelReader } from "@/lib/handle";
import { Input } from "@/components/ui/input";
import {toast} from "react-toastify";
import {useEmployeeStore} from "@/stores/employee";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}  from "@/components/ui/select";
import {getToken} from "@/lib/cookie";
import {adminGetTeamMember} from "@/api/employee";
import CardUser from "@/components/ui/card_user";
import { useForm } from "react-hook-form";
import { adminCreateProject } from "@/api/project";

const taskKey = ["name","description","deadline"]
const budgetKey = ["total","spent","category"]

const ProjectDialog = ({closeDialog}:{closeDialog:() => void}) => {
  const {register,handleSubmit} = useForm()
  const [file,setFile] = useState<File | null>(null)
  const [fileBudget,setFileBudget] = useState<File | null>(null)
  const [task,setTask] = useState<any>(null)
  const [budget,setBudget] = useState<any>(null)
  const [memberData,setMemberData] = useState<any>(null)
  const [currentTeam,setCurrentTeam] = useState<any>(null)
  const {team} = useEmployeeStore()

  useEffect(() => {
    const readFile = async () => {
      if (file) {
        const result:any = await ExcelReader(file)
        const keyFromExcel = Object.keys(result[0])
        const checkKeyIsExist = keyFromExcel.every((d:string) => taskKey.includes(d))
        if(!checkKeyIsExist) return toast.error("Key of excel does not match")
        setTask(result.map((d:any) => ({task_name:d.name,description:d.description,due_date:d.deadline,assigned_to:""})))
      }
      if(fileBudget){
        const result:any = await ExcelReader(fileBudget)
        const keyFromExcel = Object.keys(result[0])
        const checkKeyIsExist = keyFromExcel.every((d:string) => budgetKey.includes(d))
        if(!checkKeyIsExist) return toast.error("Key of excel does not match")
        setBudget(result.map((d:any) => ({total:d.total,spent:d.spent,category:d.category})))
      }
    }
    readFile()
  },[file,fileBudget])

  useEffect(() => {
    if (currentTeam) {
      const getTeam = async () => {
        //check team member data is already exist
        const teamDataIsExist = memberData ? memberData.filter((d:any) => d.team_id === currentTeam).length : 0
        //if data is exist return
        if(teamDataIsExist.length > 0) return

        //if data it not exist => get data team member and save into state memberData
        const token = await getToken()
        const res = token && await adminGetTeamMember(token,currentTeam)
        res.status !== 200 && toast.error("Get team member error")
        const dataAppend = {
          id: currentTeam,
          data:res.data.map((d:any) => ({
            ...d,
            isChecked:false
          }))
        }
        memberData && setMemberData([...memberData,dataAppend])
        !memberData && setMemberData([dataAppend])
      } 
      getTeam()
    } 
  },[currentTeam])
  const handleChangeChecked = (id:number,e_id:number,currentChecked:boolean) => {
    memberData && setMemberData(
      memberData.map((d:any) => ({
        ...d,
        data: d.id === id ? d.data.map((d:any) => d.employee_id === e_id ? {...d,isChecked:!currentChecked} : d) : d.data
      })
      )
    )
  }
  const onSubmit = async(data:any) => {
    if(!task) return toast.error("Task is required")
    const checkAssignedTask = task.filter((t:any) => t.assigned_to === "")
    if(checkAssignedTask.length > 0) return toast.error("Assigned Task")
    if(!memberData) return toast.error("Member is required")
    const employeeInProject = memberData.flatMap((d:any) => d.data.filter((d:any) => d.isChecked))
    const insertData = {
      project:{
        project_name:data.name,
        description:data.description,
        start_date:data.start_date,
        end_date:data.end_date,
        status:'planning'
      },
      task:task.map((d:any) => {
        return{
        task_name:d.task_name,
        description:d.description,
        due_date:d.due_date.split(" ")[0],
        assigned_to:d.assigned_to,
        status:'not_started'
        }
      }),
      assignment:employeeInProject.map((d:any) => ({
        employee_id:d.employee_id,
        role_in_project:d.role,
      })),
      budget:budget
    }
    const token = await getToken()
    const res = token && await adminCreateProject(token,insertData)
    if(res.status !== 201) return toast.error("Create project error")
    //set project data
    closeDialog()
  }
  const handleCancel = () => {
    setFile(null)
    setFileBudget(null)
    setTask(null)
    setBudget(null)
    setCurrentTeam(null)
    setMemberData(null)
    closeDialog() 
  }
  const handleAssignedTask = (index:number,id:number) => {
    task && setTask(
      task.map((d:any,i:number) => ({
        ...d,
        assigned_to:index === i ? id : d.assigned_to
      }))
    )
  }
  const handleChangeBudget = (index:number,col:string,value:string) => {
    budget && setBudget(
      budget.map((d:any,i:number) => ({
        ...d,
        [col]:index === i ? value : d[col]
      }))
    )
  }
  return <AlertDialogContent>
    <AlertDialogTitle className="text-3xl">New Project</AlertDialogTitle>
    <div className="w-[95vw] h-[80vh] grid grid-cols-10 gap-x-4">
      <div className="formProject col-span-3 w-full grid grid-cols-3 content-start gap-2">
        <Input {...register("description",{required:true})} placeholder="Description" className="col-span-2 text-white" />
        <Input {...register("name",{required:true})} placeholder="Project Name" className="text-white" />
        <input {...register("start_date",{required:true})} className="bg-zinc-800 text-gray-200 border-0 rounded-md p-2" type="date" />
        <input {...register("end_date",{required:true})} className="bg-zinc-800 text-gray-200 border-0 rounded-md p-2" type="date" />
        <div className="employee w-full">
          <Select onValueChange={(v) => setCurrentTeam(v)} value={currentTeam || ""}>
            <SelectTrigger className="bg-zinc-700 border-none text-white">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
             <SelectContent className="bg-zinc-700 border-none text-white">          
              {team && team.map((t:any) => <SelectItem key={t.team_id} value={t.team_id}>{t.team_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {currentTeam &&<div className="col-span-3 grid grid-cols-3 gap-2">
          <h3 className="col-span-3 text-xl font-bold">Add employee into project</h3>
          {memberData && memberData
             .filter((m:{id:number,data:any[]}) => m.id === currentTeam)[0]?.data
            .map((d:any) => <CardUser key={d.employee_id} 
              click={() => handleChangeChecked(currentTeam,d.employee_id,d.isChecked)}
              name={`${d.first_name} ${d.last_name}`} role={d.role} isChecked={d.isChecked} />)}
        </div>}
        {memberData &&<div className="col-span-3 grid grid-cols-3 gap-x-2 gap-y-6">
          <h3 className="col-span-3 text-xl font-bold">Employee in project</h3>
          {memberData
            .flatMap((m:{id:number,data:any[]}) => m.data).filter((d:any) => d.isChecked)
            .map((d:any) => <CardUser key={d.employee_id} name={`${d.first_name} ${d.last_name}`} role={d.role} isChecked />)}
        </div>}
      </div> 
      <div className="budget col-span-3 flex flex-col">
        <h3 className="text-xl font-bold">Budget</h3>
        {!fileBudget && <div className="my-2">
          <BtnExcel setFile={setFileBudget} />
        </div>}
        <div className="w-full flex flex-col">
            <div className="w-full h-8 grid grid-cols-4">
              <div>Total</div>
              <div>Amount</div>
              <div className="col-span-2">Category</div>
            </div>
            <div className="w-full overflow-y-auto grid grid-cols-4 gap-2 p-2">
              {budget && budget.map((d:any,i:number) => <div key={i} className="col-span-4 grid grid-cols-4 gap-2">
                <Input onChange={(e) => handleChangeBudget(i,"total",e.target.value)} type="number" defaultValue={d.total} className="text-white" />
                <Input onChange={(e) => handleChangeBudget(i,"spent",e.target.value)} type="number" defaultValue={d.spent} className="text-white" />
                <Input onChange={(e) => handleChangeBudget(i,"category",e.target.value)} type="text" defaultValue={d.category} className="col-span-2 text-white" />
              </div>)}
            </div>
        </div>
      </div>

      <div className="task col-span-4 w-full grid grid-cols-5 content-start gap-2">
          <h3 className="col-span-5 text-xl font-bold">Task</h3>
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
            <div className="w-full h-[90%] overflow-y-scroll grid grid-cols-5 gap-x-1 gap-y-4">
              {task && task.map((d:any,i:number) => <div key={i} className="col-span-5 grid grid-cols-5 gap-1">
                <Input {...register(`task.${i}.task_name`,{required:true})} defaultValue={d.task_name} placeholder="Task name" className="col-span-1" />
                <Input {...register(`task.${i}.description`,{required:true})} 
                  defaultValue={d.description} placeholder="Description" className="col-span-2" />
                <Input {...register(`task.${i}.deadline`,{required:true})} defaultValue={d.due_date} placeholder="Deadline" className="" />
                <div className="employee w-full">
                  <Select onValueChange={(v:any) => handleAssignedTask(i,v)}>
                    <SelectTrigger className="bg-zinc-700 border-none">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                     <SelectContent className="bg-zinc-700 border-none">          
                      {memberData && memberData
                        .flatMap((m:{id:number,data:any[]}) => m.data).filter((d:any) => d.isChecked)
                        .map((d:any) => <SelectItem key={d.employee_id} value={d.employee_id}>{`${d.first_name} ${d.last_name}`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>)}
            </div>
            {/**/}
          </div>
        </div>

    </div>
    <AlertDialogFooter>
      <AlertDialogAction onClick={handleSubmit(onSubmit)} className="bg-blue-500 text-white cursor-pointer">Save</AlertDialogAction>
      <AlertDialogCancel onClick={handleCancel} className="bg-red-500 text-white cursor-pointer border-none">Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default ProjectDialog
