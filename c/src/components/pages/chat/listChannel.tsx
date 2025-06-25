'use client'
import BtnDialog from "@/components/btn_dialog"
import {AppContext} from "@/contexts/app"
import { UserPlus } from "lucide-react"
import { use,useState } from "react"
import ChannelDialog from "./dialog/channel"
import {Channel} from "@/@types/chat"
const ListChannel = ({setId,setInfo}:{
  setId:React.Dispatch<React.SetStateAction<string | null>>,
  setInfo:React.Dispatch<React.SetStateAction<Channel | null>>
  }) => {
  const {isAdmin,channel} = use(AppContext)
  const [isDialog,setIsDialog] = useState<{channel?:boolean,addMember?:boolean}>({
    channel:false,
    addMember:false
  })
  const handleSelectChannel = (item:Channel) => {
    setId(item._id!)
    setInfo(item)
  }
  return <div className="col-span-1 h-full flex flex-col justify-start">
    {isAdmin && <div className="btn_channel w-full h-10 flex items-center justify-start">
      <BtnDialog title="+ Create Channel" btnClass="btn_create text-white cursor-pointer" 
      isOpen={isDialog.channel as boolean} openChange={(isOpen) => setIsDialog({...isDialog,channel:isOpen})}
      Component={ChannelDialog} />
      <button className="bg-blue-500 p-1 rounded-md cursor-pointer mx-1"><UserPlus /></button>
    </div>}
    <div className={`listChannel w-full ${isAdmin ? 'h-[88%]' : 'h-full' } flex flex-col overflow-y-auto p-2`}>
      {channel.map((item:Channel) => {
        return <div key={item._id} className="channel w-full h-10 flex items-center justify-between">
          <div onClick={() => handleSelectChannel(item)} className="w-full hover:bg-zinc-800 transition-all p-1 rounded-md cursor-pointer mx-1">
            # {item.name}
          </div>
        </div>
      })}
    </div>
  </div>
}
export default ListChannel
