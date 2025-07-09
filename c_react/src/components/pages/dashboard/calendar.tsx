import { useState,use,useEffect } from "react"
import { Button } from "@/components/ui/button_radix"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react"
import { AppContext } from "@/contexts/app"
import { useTaskStore } from "@/stores/task"
interface Task {
  task_id: number
  task_name: string
  description: string
  due_date: string
  status: "completed" | "in_progress" | "not_started" | "overdue" | "review"
}


export default function TaskCalendar() {
  const {isAdmin} = use(AppContext)
  const {statusTask } = useTaskStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  useEffect(() => {
    const statusList = ["completed", "in_progress", "not_started", "overdue", "review"];
    const data = statusTask && statusList.flatMap((status) => statusTask?.[status as keyof typeof statusTask]?.data?.flatMap((item: any) => ({
          task_id: item.task_id,
          task_name: item.task_name,
          description: item.description,
          due_date: item.due_date.split("T")[0],
          status: item.status  
        }))) || []
    setTasks(data);

  },[statusTask])
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getTasksForDate = (dateString: string) => {
    return tasks.filter((task) => task.due_date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }


  const toggleTaskComplete = (taskId: number) => {
    setTasks((prev) => prev.map((task) => (task.task_id === taskId ? { ...task,status: task.status === "completed" ? "in_progress" : "completed" } : task)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-500 text-while border-yellow-200"
      case "in_progress":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayTasks = getTasksForDate(dateString)
      const isToday = dateString === formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 rounded-md p-1 cursor-pointer group hover:bg-gray-50 ${
            isToday ? "bg-blue-50 border-blue-200" : ""
          }`}
          onClick={() => setSelectedDate(dateString)}
        >
          <div className={`text-sm font-medium mb-1 group-hover:text-gray-900 transition-all ${isToday ? "text-blue-600" : "text-gray-100"}`}>{day}</div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map((task) => (
              <div
                key={task.task_id}
                className={`text-xs p-1 rounded truncate ${getStatusColor(task.status)}`}
              >
                {task.task_name}
              </div>
            ))}
            {dayTasks.length > 2 && <div className="text-xs text-gray-500">+{dayTasks.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return !isAdmin && <div className="col-span-7 ">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          Task Calendar
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-0 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium border-b">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Task Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {selectedDate ? `Tasks for ${selectedDate}` : "Select a Date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateTasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateTasks.map((task) => (
                      <div
                        key={task.task_id}
                        className={`p-3 border rounded-lg ${task.status !== "completed" ? "bg-gray-50 opacity-75" : "bg-white"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`font-medium text-gray-900`}>{task.task_name}</h4>
                            {task.description && (
                              <p className={`text-sm text-gray-900 mt-1 `}>
                                {task.description}
                              </p>
                            )}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => toggleTaskComplete(task.task_id)}>
                            {task.status !== "completed" ? "Undo" : "Done"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No tasks for this date</p>
                )
              ) : (
                <p className="text-gray-500 text-center py-4">Click on a date to view tasks</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
}

