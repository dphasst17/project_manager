import {useEmployeeStore} from "@/stores/employee"
import {useEffect,useState,use} from "react"
import {AppContext} from "@/contexts/app"
const Team = () => {
  const {team} = useEmployeeStore()
  const [data,setData] = useState<any>([])
  const {isAdmin} = use(AppContext)
  useEffect(() => {team && setData(team)},[team])
  return isAdmin && data && <div className="w-full col-span-7">
    <p className="text-2xl font-semibold text-zinc-100 my-4">Team</p>
    <div className="w-full h-auto grid grid-cols-4 gap-6 mb-4 px-2">
      {data.map((d:any) => <div key={d.team_id} 
        className="w-full h-10 bg-[#000] text-white hover:scale-105 border border-zinc-700 rounded-md flex flex-col items-center cursor-pointer transition-all">
        <div className="w-full h-full flex justify-center items-center">
          {d.team_name}
        </div>
      </div>)}
    </div>
  </div>
}

export default Team
