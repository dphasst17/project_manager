import { useProjectStore } from "@/stores/project";
import { useEmployeeStore } from "@/stores/employee";
import { useEffect, useState,use } from "react";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table"
import { ScanEye,EllipsisVertical } from "lucide-react";
import {AppContext} from "@/contexts/app";
import {useRouter} from "next/navigation";

const Project = () => {
  const { project,employeeProject } = useProjectStore()
  const { employee } = useEmployeeStore()
  const { isAdmin, isManager,setProjectId } = use(AppContext)
  const [data,setData] = useState([])
  const [page,setPage] = useState<{list:number[] | [],current:number}>({
  list:[],
  current:1
  })
  const router = useRouter()
  useEffect(() => {
  if(employee){
    isAdmin ? project && setData(project.data) : employeeProject && setData(employeeProject.data)
    isAdmin ? project && setPage({
      list:[...Array(project.total)].map((_, i) => i + 1),
      current:1
    })
    : employeeProject && setPage({
      list:[...Array(employeeProject.total)].map((_, i) => i + 1),
      current:1
    })
  }
  },[employee,project,employeeProject])
  
  return <div className="w-full h-full col-span-5 bg-zinc-900 text-white p-1 rounded-md">
    {/*table for show ui project include name, description, start date, end date and action*/}
    <Table>
      <TableHeader>
        <tr>
          <TableHead >Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {
          data.map((item:any) => (
            <TableRow key={item.project_id}>
              <TableCell>{item.project_name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.start_date.split('T')[0].split('-').reverse().join('/')}</TableCell>
              <TableCell>{item.end_date.split('T')[0].split('-').reverse().join('/')}</TableCell>
              <TableCell className="flex justify-around">
                {(isAdmin || isManager) && 
                  <ScanEye onClick={() => {setProjectId(item.project_id);router.push(`/project`)}} className="cursor-pointer" />
                }
                {isAdmin && <EllipsisVertical className="cursor-pointer" />}
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
    {/*<Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>

        {page.list.map((item) => <PaginationItem key={`page-${item}`}>
          <PaginationLink isActive>
              {item}
            </PaginationLink>
          </PaginationItem>
        )} 
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>*/}
  </div>

}
export default Project

