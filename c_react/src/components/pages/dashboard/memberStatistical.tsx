import { useTaskStore } from "@/stores/task"
import { useProjectStore } from "@/stores/project"
import { FolderOpen,ListCheck,ListTodo } from "lucide-react"
import StatisComponent from "@/components/ui/statistical"

const MemberStatistical = () => {
  const { statusTask } = useTaskStore()
  const { employeeProject } = useProjectStore()

  return <div className="col-span-3 grid grid-cols-2 gap-2">
    {employeeProject && <StatisComponent title="Project" value={employeeProject.total} Icon={FolderOpen} bgIcon="bg-[#a5f3fc]" color="text-[#1d4ed8]" />}
    {statusTask && <StatisComponent title="Completed Task" value={statusTask.completed.total.toString()} Icon={ListCheck} bgIcon="bg-[#a5f3fc]" color="text-[#1d4ed8]" />}
    {statusTask && <StatisComponent title="In Progress Task" value={statusTask.in_progress.total.toString()} Icon={ListTodo} bgIcon="bg-[#a5f3fc]" color="text-[#1d4ed8]" />}
  </div>
}
export default MemberStatistical
