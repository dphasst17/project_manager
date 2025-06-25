import { AlertDialogContent, AlertDialogFooter, AlertDialogTitle,AlertDialogAction,AlertDialogCancel } from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react"
import { useEmployeeStore } from "@/stores/employee"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import CardUser from "@/components/ui/card_user"
import { getToken } from "@/lib/cookie"
import { adminGetTeamMember } from "@/api/employee"
import { createChannel } from "@/api/chat"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
const ChannelDialog = ({closeDialog}:{closeDialog:() => void}) => {
  const {register,handleSubmit} = useForm()
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
  const onSubmit = async(data:any) => {
    if(!memberData) return toast.error("Member is required")
    const employeeChecked = memberData.flatMap((d:any) => d.data.filter((d:any) => d.isChecked))
    const insertData = {
      name:data.name,
      members:employeeChecked.map((d:any) => d.employee_id)
    }
    const token = await getToken()
    const res = token && await createChannel(token,insertData)
    res.status === 201 && toast.success("Create channel success")
    closeDialog()
  }
  return <AlertDialogContent>
    <AlertDialogTitle>Create Channel</AlertDialogTitle>
    <div className="w-[700px] grid grid-cols-3 gap-2">
      <div className="col-span-2 flex flex-col items-start">
        <label className="w-1/3">#Channel Name</label>
        <input {...register("name",{required:true})} className="w-full border border-gray-400 rounded-md p-1" />
      </div>
      <div className="col-span-1 flex flex-col items-start">
        <p className="w-full">Add Members to Channel</p>
        <div className="employee w-full">
          <Select onValueChange={(v) => setCurrentTeam(v)} value={currentTeam || ""}>
            <SelectTrigger className="bg-zinc-700 border-none text-white">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
             <SelectContent className="bg-zinc-700 border-none text-white">          
              {team && team.map((t:any) => <SelectItem key={t.team_id} value={t.team_id}>{t.team_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="col-span-3">
        {currentTeam &&<div className="col-span-3 grid grid-cols-3 gap-2">
          <h3 className="col-span-3 text-xl font-bold">Add employee into project</h3>
          {memberData && memberData
             .filter((m:{id:number,data:any[]}) => m.id === currentTeam)[0]?.data
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
    </div>
    <AlertDialogFooter>
      <AlertDialogAction className="bg-blue-600 text-white" onClick={handleSubmit(onSubmit)}>Save</AlertDialogAction>
      <AlertDialogCancel className="bg-red-600 border-none text-white" onClick={closeDialog}>Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default ChannelDialog
