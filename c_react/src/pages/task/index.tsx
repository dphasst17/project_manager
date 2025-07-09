import NotStartedTask from "@/components/pages/task/not_started"
import TodoTask from "@/components/pages/task/todo"

const TaskPage = () => {
  return <div className="w-full h-screen grid grid-cols-1 gap-4 content-start pt-10">
    <TodoTask />
    <NotStartedTask />
  </div>
}
export default TaskPage
