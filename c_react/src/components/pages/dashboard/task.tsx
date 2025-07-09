import CardMac from "@/components/ui/card_mac";
import { useTaskStore } from "@/stores/task";
import { useEffect, useState,use } from "react";
import * as ct from "@/constants/index"
import { AppContext } from "@/contexts/app";
import {useEmployeeStore} from "@/stores/employee";
import Button from "@/components/ui/button";
import { adminGetAllTask, getTaskByStatus } from "@/api/project";
import {getToken} from "@/libs/cookie";

const Tasks = () => {
  const {task,statusTask} = useTaskStore()
  const {employee} = useEmployeeStore()
  const [data,setData] = useState<any>([])
  const [page,setPage] = useState<{total:number,limit:number,current:number,totalPage:number}>({
    total:0,
    limit:0,
    current:0,
    totalPage:0
  })
  const {isAdmin} = use(AppContext)
  useEffect(() => {
    if(isAdmin){
      task && setData(task.data)
      task && setPage({
          total:task.total,
          limit:task.limit,
          current:task.page,
          totalPage:task.totalPage
        })
    }else{
      statusTask && setData(statusTask.completed.data.map((item:any) => ({
        ...item,
        employee: employee
      })))
      statusTask && setPage({
        total:statusTask.completed.total,
        limit:statusTask.completed.limit,
        current:statusTask.completed.page,
        totalPage:statusTask.completed.totalPage
      })
    }
  },[task,employee,statusTask])
  const handleLoadData= () => {
    if(page.current < page.totalPage){
    const lengthData = data.length
      const getData = async() => {
        const token = await getToken()
        const res = token && await (isAdmin ? adminGetAllTask(token,page.current + 1,page.limit) 
        : getTaskByStatus('employee',token,'completed',page.current + 1,page.limit))
        if(res && res.status === 200){
          setData([...data,...res.data.data])
          setPage({
            ...page,
            current:page.current + 1
          })
        }
      }

      lengthData < (page.limit * page.current) ? getData() : setPage({
        ...page,
        current:page.current + 1
      })
    }
  }
  const handleHide = () => {
    setPage({
      ...page,
      current:1
    })
  }
  return <div className="h-full col-span-7 grid grid-cols-4 gap-2 p-1 rounded-md">
    {
      data.slice(0,page.current * page.limit).map((item:any) => <CardMac title={item.task_name} description={item.description}
      tag={
        [
          `${item.employee.first_name} ${item.employee.last_name}`,
          item.due_date.split('T')[0].split("-").reverse().join("/"),
          ct[item.status as keyof typeof ct]
        ]
      }
      key={item.task_id} />)
    }
    <div className="col-span-4 flex justify-start">
      {page.totalPage > 1 && page.current < page.totalPage && <Button handle={handleLoadData} content="Load More" />}
      {page.totalPage > 1 && page.current === page.totalPage && <Button handle={handleHide} content="Hide" />}
    </div>
  </div>
}
export default Tasks
