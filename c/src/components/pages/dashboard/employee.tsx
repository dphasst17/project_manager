import {useEmployeeStore} from "@/stores/employee"
import {useEffect, useState} from "react"
import CardProfile from "@/components/ui/card_profile"
import Button from "@/components/ui/button"
import {adminGetAllEmployee} from "@/api/employee"
import {getToken} from "@/lib/cookie"
const AdminEmployee = () => {
  const {adminEmployee} = useEmployeeStore()
  const [data,setData] = useState<any>([])
  const [page,setPage] = useState({
    limit:0,
    current:0,
    totalPage:0
  })
  useEffect(() => {
  if(adminEmployee){
    setData(adminEmployee.data)
    setPage({
      limit:adminEmployee.limit,
      current:adminEmployee.page,
      totalPage:adminEmployee.totalPage
    })
  }
  },[adminEmployee])
  const handleLoadData= () => {
    if(page.current < page.totalPage){
      const lengthData = data.length
      const getData = async() => {
        const token = await getToken()
        const res = token && await adminGetAllEmployee(token,page.current + 1,page.limit)
        if(res && res.status === 200){
          setData([...data,...res.data.data])
          setPage({
            ...page,
            current:page.current + 1
          })
        }
      }
      lengthData < (page.limit * page.current + 1)  ? getData() : setPage({
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

  return <div className="w-full h-full col-span-7 grid grid-cols-5 gap-2 p-1 rounded-md">
    {data.slice(0,page.limit * page.current)
    .map((item:any) => <CardProfile key={item.employee_id} name={`${item.first_name} ${item.last_name}`} 
    email={item.email} 
    role={item.role[0]?.role || ""} />
    )}
    <div className="col-span-4 flex justify-start">
      {page.totalPage > 1 && page.current < page.totalPage && <Button handle={handleLoadData} content="Load More" />}
      {page.totalPage > 1 && page.current === page.totalPage && <Button handle={handleHide} content="Hide" />}
    </div>

  </div>

}
export default AdminEmployee
