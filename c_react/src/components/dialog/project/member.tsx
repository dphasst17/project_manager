import {AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getToken } from "@/libs/cookie"
import { adminGetTeamMember } from "@/api/employee"
import { adminAppendDataProject } from "@/api/project"
import { useEmployeeStore } from "@/stores/employee"
import CardUser from "@/components/ui/card_user"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}  from "@/components/ui/select";

const MemberDialog = ({id,memberInProject,closeDialog}:{id:number | string,memberInProject:any,closeDialog:() => void}) => {
  const [memberData,setMemberData] = useState<any>(null)
  const [currentTeam,setCurrentTeam] = useState<any>(null)
  const {team} = useEmployeeStore()
  useEffect(() => {
    if (currentTeam) {
      const getTeam = async () => {
        //check team member data is already exist
        const teamDataIsExist = memberData ? memberData.filter((d:any) => d.team_id === currentTeam).length : 0
        //if data is exist return
        if(teamDataIsExist.length > 0) return

        //if data it not exist => get data team member and save into state memberData
        const token = await getToken()
        const res = token && await adminGetTeamMember(token,currentTeam)
        res.status !== 200 && toast.error("Get team member error")
        const dataAppend = {
          id: currentTeam,
          data:res.data.map((d:any) => ({
            ...d,
            isChecked:false
          }))
        }
        memberData && setMemberData([...memberData,dataAppend])
        !memberData && setMemberData([dataAppend])
      } 
      getTeam()
    } 
  },[currentTeam])
  const handleChangeChecked = (id:number,e_id:number,currentChecked:boolean) => {
    memberData && setMemberData(
      memberData.map((d:any) => ({
        ...d,
        data: d.id === id ? d.data.map((d:any) => d.employee_id === e_id ? {...d,isChecked:!currentChecked} : d) : d.data
      })
      )
    )
  }
  const handleUploadMember = async () => {
    const employeeInProject = memberData.flatMap((d:any) => d.data.filter((d:any) => d.isChecked))
    if(employeeInProject.length === 0) return toast.error("Member is required")
    const token = await getToken()
    const convertData = employeeInProject.map((d:any) => ({project_id:id,employee_id:d.employee_id,role_in_project:d.role}))
    const res = token && await adminAppendDataProject(token,{type:"project_assignments",value:convertData})
    if(res.status !== 201) return toast.error("Failed to upload data")
    toast.success("Success to upload data")
    setMemberData(null)
    setCurrentTeam(null)
    handleClose()
  }
  const handleClose = () => {
    setMemberData(null)
    setCurrentTeam(null)
    closeDialog()
  }
return <AlertDialogContent>
  <AlertDialogTitle>Member</AlertDialogTitle>
  <div className="w-[50vw] h-[50vh] flex flex-col gap-2">
    <div className="employee w-1/5">
        <Select onValueChange={(v) => setCurrentTeam(v)} value={currentTeam || ""}>
          <SelectTrigger className="bg-zinc-700 border-none text-white">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
           <SelectContent className="bg-zinc-700 border-none text-white">          
            {team && team.map((t:any) => <SelectItem key={t.team_id} value={t.team_id}>{t.team_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {currentTeam &&<div className="col-span-3 grid grid-cols-3 gap-2">
        <h3 className="col-span-3 text-xl font-bold">Add employee into project</h3>
        {memberData && memberData             
          .filter((m:{id:number,data:any[]}) => m.id === currentTeam)[0]?.data
          .filter((d:any) => memberInProject && !memberInProject.includes(d.employee_id))
          .map((d:any) => <CardUser key={d.employee_id} 
            click={() => handleChangeChecked(currentTeam,d.employee_id,d.isChecked)}
            name={`${d.first_name} ${d.last_name}`} role={d.role} isChecked={d.isChecked} />)}
      </div>}
      {memberData &&<div className="col-span-3 grid grid-cols-3 gap-x-2 gap-y-6">
        <h3 className="col-span-3 text-xl font-bold">Employee in project</h3>
        {memberData
          .flatMap((m:{id:number,data:any[]}) => m.data).filter((d:any) => d.isChecked)
          .map((d:any) => <CardUser key={d.employee_id} name={`${d.first_name} ${d.last_name}`} role={d.role} isChecked />)}
      </div>}
  </div>
  <AlertDialogFooter>
    <AlertDialogAction className="bg-blue-600 cursor-pointer border-none" onClick={handleUploadMember}>Save</AlertDialogAction>
    <AlertDialogCancel className="bg-red-600 cursor-pointer border-none" onClick={handleClose}>Cancel</AlertDialogCancel>
  </AlertDialogFooter>
 </AlertDialogContent> 
}
export default MemberDialog
