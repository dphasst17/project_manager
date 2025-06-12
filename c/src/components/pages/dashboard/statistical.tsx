import { FolderOpen,Users,Logs } from "lucide-react"
import { useProjectStore } from "@/stores/project"
import {useEmployeeStore} from "@/stores/employee"
import {useTaskStore} from "@/stores/task"

const StatisComponent = ({title,value,Icon,bgIcon,color}:{title:string,value:string,Icon:any,bgIcon:string,color:string}) => {
  return <div className="statisItem grid grid-cols-4 gap-x-2 h-[100px] shadow-md bg-[#000] border border-zinc-700 rounded-md px-8">
      <div className="statisContent col-span-3 h-full flex flex-col justify-center items-start">
        <p className="text-md font-semibold text-zinc-400">{title}</p>
        <p className="text-4xl font-semibold text-white">{value}</p>
      </div>
      <div className="statisIcon h-full flex justify-center items-center">
        <div className={`iconItem w-4/5 h-2/4 flex justify-center items-center rounded-md ${bgIcon.toString()}`}>
          <Icon className={`w-8 h-8 ${color}`}/>
        </div>
      </div>
    </div>

}

const Statistical = () => {
  const {project} = useProjectStore()
  const {adminEmployee,team} = useEmployeeStore()
  const {task} = useTaskStore()

  return <div className="w-full h-auto grid grid-cols-4 gap-x-4 mb-4 px-2">
    {project && <StatisComponent title="Project" value={project.total} Icon={FolderOpen} bgIcon="bg-[#a5f3fc]" color="text-[#1d4ed8]" />}
    {adminEmployee && <StatisComponent title="Employee" value={adminEmployee.total} Icon={Users} bgIcon="bg-[#86efac]" color="text-[#15803d]" />}
    {team && <StatisComponent title="Team" value={team.length} Icon={Users} bgIcon="bg-[#86efac]" color="text-[#15803d]" />}
    {task && <StatisComponent title="Task" value={task.total.toString()} Icon={Logs} bgIcon="bg-[#fed7aa]" color="text-[#c2410c]" />}
  </div>
}
export default Statistical
