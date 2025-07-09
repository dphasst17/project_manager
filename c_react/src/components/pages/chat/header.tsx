import { PanelRight,Video } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router";
import { endCode } from "@/libs/handle";
import { use } from "react";
import { AppContext } from "@/contexts/app";
import { toast } from "react-toastify";
import { useSocket } from "@/hooks/socket";
import { useEmployeeStore } from "@/stores/employee";
const ChatHeader = ({info,rightPanel,setIsRightPanel}:{info:any,rightPanel:boolean,setIsRightPanel:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate();
  const socketRef = useSocket();
  const { employee } = useEmployeeStore();
  const {isMeeting,onMeeting,setOnMeeting} = use(AppContext) 
  const handleVideoCall = () => {
    const id = uuid();
    const k = import.meta.env.VITE_SK!;
    if(isMeeting){
      const employeeData = employee && endCode(employee.employee_id.toString(),k)
      !onMeeting && (navigate(`${isMeeting}&i=${employeeData}`),setOnMeeting(true))
      onMeeting && toast.error('You are already in a meeting')
      return
    }

    const list = info.members.map((u: any) => u.id);
    const url = `/room/${id}&list=${endCode(list,k)}`;
    socketRef.current?.emit("on_meeting", { channel: info && info._id, url: url });
    navigate(url);
    return;
  };
  return <div className="headerChat w-full h-20 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {info &&<div className="flex flex-col">
          <div className="text-white text-2xl font-semibold">#{info.name}</div>
          <div className="text-zinc-400 text-sm">{info.members.length} members</div>
        </div>}
      </div>
      <div className="flex justify-center items-center">
        <div className="relative">
          <Video onClick={handleVideoCall} className="w-8 h-8 text-white cursor-pointer mx-2" />
          {isMeeting && <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>}
        </div>
        <PanelRight onClick={() => setIsRightPanel(!rightPanel)} className="w-7 h-7 text-white cursor-pointer" />
      </div>
    </div>
};

export default ChatHeader;
