import { FolderOpen,Users,Logs } from "lucide-react"
import { useProjectStore } from "@/stores/project"
import { useEmployeeStore } from "@/stores/employee"
import { useTaskStore } from "@/stores/task"
import StatisComponent from "@/components/ui/statistical"

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
