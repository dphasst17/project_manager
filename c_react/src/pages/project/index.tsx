import { useQuery } from "@tanstack/react-query"
import { getProjectDetail } from "@/api/project"
import { useEffect, useState,use } from "react"
import { useParams } from "react-router"
import { formatDate } from "@/libs/handle"
import CardUser from "@/components/ui/card_user";
import { Calendar1 } from "lucide-react"
import Progress from "@/components/ui/progress"
//import dialog
import BtnDialog from "@/components/ui/btn_dialog"
import MemberDialog from "@/components/dialog/project/member"
import {AppContext} from "@/contexts/app"
import BudgetOverview from "@/components/pages/project/budget"
import TaskOverview from "@/components/pages/project/task"
const ProjectPage = () => {
  const {isAdmin} = use(AppContext)
  const params = useParams()
  const projectId = Number(params.id)
  const {data,isLoading} = useQuery({
    queryKey: ['project-detail', params.id],
    queryFn: () => getProjectDetail(Number(params.id)),
    enabled: !!params.id,
  })
  const [projectData,setProjectData] = useState<any>(null)
  const [isOpen,setIsOpen] = useState<{budget?:boolean,task?:boolean,member?:boolean}>({
    budget:false,
    task:false,
    member:false
  })
  useEffect(() => {
    if (data) {
      const completeTask = data.data[0].task.filter((d:any) => d.status === "completed").length
      const totalTask = data.data[0].task.length
      const progressProject = caculateProgress(completeTask,totalTask)
      const totalBudget = data.data[0].budgets.reduce((prev:any,curr:any) => prev + curr.total_budget,0)
      const spentAmount = data.data[0].budgets.reduce((prev:any,curr:any) => prev + curr.spent_amount,0)
      const progressBudget = caculateProgress(spentAmount,totalBudget)
      setProjectData({
        ...data.data[0],
        progress:progressProject,
        totalBudget,
        spentAmount,
        progressBudget:Math.floor(progressBudget)
      })
    }
  },[data,projectId])
  const caculateProgress = (taskComplete: number, taskTotal: number) => {
    return (taskComplete / taskTotal) * 100
  }
  return !isLoading && projectId &&Number(projectId) !== 0 && <div className="w-full h-auto flex flex-col items-center pt-10">
    {/*Project info*/}
    <div className="w-full h-[25vh] flex items-center justify-around p-5">
       {projectData && <div className="w-[35%] h-[100px] grid grid-cols-8 gap-2">
        <div className="col-span-7 grid grid-cols-4">
          <h1 className="text-2xl font-semibold col-span-4">{projectData.project_name}</h1>
          <p className="col-span-4">{projectData.description}</p>
          <p className="col-span-4 flex"><Calendar1 className="mx-1" />{formatDate(projectData.start_date)}-{formatDate(projectData.end_date)}</p>
         </div>
        <div className="col-span-1 flex flex-col items-end gap-y-2">
          Progress
          <div className="w-full flex justify-end text-emerald-500 text-3xl font-semibold">{projectData.progress}%</div>
          <div className="w-full h-2 bg-zinc-800 rounded-md">
            {projectData && <Progress value={projectData.progress} />}
          </div>
        </div>
      </div>}
      <div className="member_overview w-3/5 ">
        <div className="w-full h-15 text-xl flex items-center justify-center font-semibold my-2">Team Overview</div>
        <div className="grid grid-cols-4 gap-2 my-1">
          <div className="col-span-3 flex justify-start gap-y-2">
             <p className="col-span-6 font-semibold">Total Member</p>
             <p className="mx-4 font-semibold">{projectData && projectData.member.length}</p>
          </div>
          <div className="col-span-1 flex justify-end h-10 h-2">
            {isAdmin && projectData && <BtnDialog title="+ Add Member" isOpen={isOpen.member as boolean} 
              openChange={() => setIsOpen({...isOpen,member:!isOpen.member})}
              btnClass="text-blue-500 cursor-pointer" Component={MemberDialog} 
              props={{id:projectId,memberInProject:projectData.member.flatMap((m:any) => m.employee_id)}}/>}
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2 overflow-y-auto">
          {projectData && projectData.member.map((d:any,index:number) => 
            <CardUser key={index} click={() => {}} name={`${d.first_name} ${d.last_name}`} role={d.role_in_project} isChecked={false} />
          )}
        </div>
      </div>
    </div>
    {/*Project Detail*/}
    <div className="w-[95%] h-auto min-h-[60vh] grid grid-cols-12 gap-x-4">
      {/*Budget overview*/}
      <BudgetOverview id={projectId} projectData={projectData} setProjectData={setProjectData} isOpen={isOpen} setIsOpen={setIsOpen}/>

      {/*Task overview*/}
      <TaskOverview id={projectId} projectData={projectData} setProjectData={setProjectData} isOpen={isOpen} setIsOpen={setIsOpen}/>

    </div>
  </div>
}
export default ProjectPage


