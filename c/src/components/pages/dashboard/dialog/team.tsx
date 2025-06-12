import {AlertDialogContent, AlertDialogFooter, AlertDialogTitle,AlertDialogAction,AlertDialogCancel} from "@/components/ui/alert-dialog"
import BtnExcel from "../btn_excel"
import {adminCreateTeam} from "@/api/employee";
import {getToken} from "@/lib/cookie";
import {toast} from "react-toastify";
import {useEmployeeStore} from "@/stores/employee";
import { useEffect, useState } from "react";
import { ExcelReader } from "@/lib/handle";
const teamKey = ["team_name","description"]
const TeamDialog = ({closeDialog}:{closeDialog:() => void}) => {
  const {team,setTeam} = useEmployeeStore()
  const [file,setFile] = useState<File | null>(null)
  const [data,setData] = useState<any>([])
  useEffect(() => {
    const readFile = async () => {
      if (file) {
        const result:any = await ExcelReader(file)
        const keyFromExcel = Object.keys(result[0])
        const checkKeyIsExist = keyFromExcel.every((d:string) => teamKey.includes(d))
        if(!checkKeyIsExist) return toast.error("Key of excel does not match")
        setData(result.map((d:any) => ({team_name:d.name,description:d.description})))
      }
    }
    readFile()
  },[file])

  const handleCreateTeam = async () => {
    if(!data) return toast.error("Data is required")
    const insertData = data.map((d:any) => {
      return {
        team_name:d.team_name,
        description:d.description
      }
    })
    const token = await getToken()
    const res = token && await adminCreateTeam(token,insertData)
    if(!res) return toast.error("Create team error")
    setTeam([...team,...res.data])
    closeDialog()
  }

  return <AlertDialogContent>
    <AlertDialogTitle>Team</AlertDialogTitle>
    <div className="w-[50vw]">
      {!file && <BtnExcel setFile={setFile}/>}
      <div className="w-full">
        <div className="tbHead w-full grid grid-cols-3">
          <div className="col-span-1">Team Name</div>
          <div className="col-span-2">Description</div>
        </div>
        {data && data.map((d:any) => (
          <div className="tbBody w-full grid grid-cols-3">
            <div className="col-span-1">{d.team_name}</div>
            <div className="col-span-2">{d.description}</div>
          </div>
        ))}
      </div>
    </div>
    <AlertDialogFooter>
      <AlertDialogAction onClick={handleCreateTeam} className="bg-blue-600 text-white cursor-pointer border-none">Save</AlertDialogAction>
      <AlertDialogCancel onClick={closeDialog} className="bg-red-600 text-white cursor-pointer border-none">Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default TeamDialog
