import { AlertDialogContent, AlertDialogFooter, AlertDialogTitle,AlertDialogAction,AlertDialogCancel } from "@/components/ui/alert-dialog"
import BtnExcel from "../btn_excel"
import { useState, useEffect } from "react"
import { ExcelReader } from "@/lib/handle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}  from "@/components/ui/select";
import {toast} from "react-toastify"
import {Input} from "@/components/ui/input";
import {useEmployeeStore} from "@/stores/employee";
import {getToken} from "@/lib/cookie";
import {signUp} from "@/api/auth";
interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  username:string
  team_id?:number
  position?:string
}
const excelKey = ["firstName", "lastName", "email","username","password"]
const EmployeeDialog = ({closeDialog}:{closeDialog:() => void}) => {
  const [file,setFile] = useState<File | null>(null)
  const [data,setData] = useState<any>([])
  const {adminEmployee,team,setAdminEmployee} = useEmployeeStore() 
  useEffect(() => {
    const readFile = async () => {
      if (file) {
        const result:any = await ExcelReader(file)
        const keyFromExcel = Object.keys(result[0])
        const checkKeyIsExist = keyFromExcel.every((d:string) => excelKey.includes(d))
        if(!checkKeyIsExist) return toast.error("Key of excel does not match")
        setData(result.map((d:EmployeeData) => ({...d,role:'3',team_id:1,position:''})))
        }
    }
    readFile()
  },[file])
  const handleSetSelectData = (m:string,key:string,value:string) => {
    setData(data.map((d:EmployeeData) => d.email === m ? {...d,[key]:value} : d))
  }
  const handleUploadData = async() => {
    if(!data) return
    const validatePosition = data.filter((d:EmployeeData) => d.position === "")
    if(validatePosition.length !== 0) return toast.error("Position is required")
    const insertData = data.map((d:EmployeeData) => {
      return {
        auth:{
          username:d.username,
          password:d.password,

        },
        employee:{
          first_name:d.firstName,
          last_name:d.lastName,
          email:d.email,

        },
        role:{
          role_id:Number(d.role),

        },
        team:{
          team_id:Number(d.team_id),
          role:d.position,

        },
      }
    })
    const token = await getToken()
    const res = token && await signUp(token,insertData)
    if(res.status !== 201) return toast.error("Create Employee Failed")
    adminEmployee && setAdminEmployee(
      {
        total:adminEmployee.total + res.data.length,
        limit:adminEmployee.limit,
        page:adminEmployee.page,
        totalPage:adminEmployee.totalPage,
        data:[...res.data,...adminEmployee.data]
      }
    )
    toast.success("Create Employee Success")
    //close dialog 
    closeDialog() 
    return
  }
  return <AlertDialogContent className="min-w-[90%]">
    <AlertDialogTitle>Add New Employee</AlertDialogTitle>
    <div className="flex flex-col justify-start">
      <div className="w-[200px]">
        <BtnExcel setFile={setFile}/>
      </div>
      <div className="w-auto h-auto grid grid-cols-1 gap-2 my-8">
        <div className="w-full h-auto grid grid-cols-12">
          <span>First Name</span>
          <span>Last Name</span>
          <span className="col-span-2">Email</span>
          <span className="col-span-2">Username</span>
          <span>Password</span>
          <span>Role</span>
          <span className="col-span-2">Team Role</span>
          <span className="col-span-2">Position</span>
        </div>
        <div className="w-full h-[500px] grid grid-cols-1 gap-2 content-start overflow-y-auto p-1">
          {data && data.map((d:EmployeeData) => <div className="w-full h-auto grid grid-cols-12 gap-x-2" key={d.email}>
            <div className="truncate flex items-center">{d.firstName}</div>
            <div className="truncate flex items-center">{d.lastName}</div>
            <div className="truncate col-span-2 flex items-center">
              <span className="truncate">{d.email}</span>
            </div>
            <div className="truncate col-span-2 flex items-center">
              <span className="truncate">{d.username}</span>
            </div>
            <div className="truncate flex items-center">{d.password}</div>
            <Select onValueChange={(v) => handleSetSelectData(d.email,'role',v)} value={d.role}>
              <SelectTrigger className="w-[100px] bg-zinc-700 border-none">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="w-[100px] bg-zinc-700 border-none">
                <SelectItem value="2">Manager</SelectItem>
                <SelectItem value="3">Member</SelectItem>
              </SelectContent>

            </Select>
            <div className="col-span-2">
              <Select onValueChange={(v) => handleSetSelectData(d.email,'team_id',v)} value={String(d.team_id)}>
                <SelectTrigger className="bg-zinc-700 border-none">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 border-none">          
                  {team && team.map((t:any) => <SelectItem key={t.team_id} value={String(t.team_id)}>{t.team_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Input type="text" onChange={(e) => handleSetSelectData(d.email,'position',e.target.value)} className="bg-zinc-700 border-none" />
            </div>
          </div>)}
        </div>
      </div>
    </div>
    <AlertDialogFooter>
      <AlertDialogAction onClick={(e) => {e.preventDefault();handleUploadData()}} className="bg-blue-500 text-white cursor-pointer">
        Save
      </AlertDialogAction>
      <AlertDialogCancel className="bg-red-500 text-white cursor-pointer border-none">Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default EmployeeDialog

