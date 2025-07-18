import BtnDialog from "@/components/ui/btn_dialog"
import { AppContext } from "@/contexts/app"
import { UserPlus } from "lucide-react"
import { use,useState,useEffect } from "react"
import ChannelDialog from "@/components/dialog/chat/channel"
import MeetingDialog from "@/components/dialog/chat/meeting"
import type { Channel, PublicMeeting } from "@/@types/chat"
import { useNavigate } from "react-router"
import { useSocket } from "@/hooks/socket"
const ListChannel = ({setId,setInfo}:{
  setId:React.Dispatch<React.SetStateAction<string | null>>,
  setInfo:React.Dispatch<React.SetStateAction<Channel | null>>
  }) => {
  const {isAdmin,channel} = use(AppContext)
  const [isDialog,setIsDialog] = useState<{channel?:boolean,addMember?:boolean,meeting?:boolean}>({
    channel:false,
    addMember:false
  })
  const [listMeeting,setListMeeting] = useState<PublicMeeting[] | []>([])
  const socketRef = useSocket()
  const navigate = useNavigate();

  useEffect(() => {
    if(socketRef.current){
      socketRef.current.emit("all_public_meeting")
      socketRef.current.on("all_public_meeting", (data:any) => {
        setListMeeting(data)
      })
      socketRef.current.on("public_meeting", (data:{id:string,title:string,url:string}) => {
        setListMeeting([...listMeeting,{id:data.id,title:data.title,url:data.url}])
      })
      socketRef.current.on("remove_public_meeting", (data:{id:string}) => {
        setListMeeting(listMeeting.filter(item => item.id !== data.id))
      })
      return () => {
        socketRef.current?.off("all_public_meeting")
        socketRef.current?.off("public_meeting")
        socketRef.current?.off("remove_public_meeting")
      }
    }
  },[socketRef,listMeeting])

  const handleSelectChannel = (item:Channel) => {
    setId(item._id!)
    setInfo(item)
  }

  return <div className="col-span-1 h-[98%] pr-4 grid grid-cols-1 grid-rows-12 gap-2 content-start">
    {isAdmin && <div className="btn_channel row-span-1 grid grid-cols-2 gap-2 content-start">
      <BtnDialog title="+ Channel" btnClass="h-8 flex justify-center items-center bg-blue-500 p-2 rounded-md text-white cursor-pointer"
      isOpen={isDialog.channel as boolean} openChange={(isOpen) => setIsDialog({...isDialog,channel:isOpen})}
      Component={ChannelDialog} />
      <button className="h-8 flex justify-center items-center bg-blue-500 p-2 rounded-md cursor-pointer">
       <UserPlus className="h-4 w-4 text-white mr-2" /> Members
      </button>
    </div>}
    <div className={`listChannel ${isAdmin ? "row-span-7" :"row-span-8"} bg-zinc-900 rounded-md flex flex-col overflow-y-auto p-2`}>
      {channel.map((item:Channel) => {
        return <div key={item._id} className="channel w-full h-10 flex items-center justify-between">
          <div onClick={() => handleSelectChannel(item)} className="w-full flex justify-between hover:bg-zinc-800 transition-all p-1 rounded-md cursor-pointer mx-1">
            <span># {item.name}</span>
            {item.unread !== 0 && <span className="w-5 h-5 flex justify-center items-center p-1 !text-[12px] text-white rounded-sm bg-red-500">{item.unread}</span>}
          </div>
        </div>
      })}
    </div>
    <div className="row-span-4 bg-zinc-900 rounded-md p-2">
      <div className="w-full grid grid-cols-6">
        <span className="col-span-3 text-white text-2xl col-span-2">Meeting</span>
        <BtnDialog title="+ Meeting" btnClass="col-span-3 h-8 flex justify-center items-center bg-blue-500 p-2 rounded-md cursor-pointer"
        isOpen={isDialog.meeting as boolean} openChange={(isOpen) => setIsDialog({...isDialog,meeting:isOpen})}
        Component={MeetingDialog} />
      </div>
      <div className="w-full h-full overflow-y-auto">
        {listMeeting.map((item:PublicMeeting) => {
          return <div key={item.id} className="meeting w-full h-10 flex items-center justify-between">
            <div onClick={() => navigate(item.url)} className="w-full hover:bg-zinc-800 transition-all p-1 rounded-md cursor-pointer mx-1">
              {item.title}
            </div>
          </div>
        })}
      </div>
    </div>
  </div>
}
export default ListChannel
