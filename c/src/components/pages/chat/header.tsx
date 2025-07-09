import { PanelRight,Video } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { endCode } from "@/lib/handle";
const ChatHeader = ({info,rightPanel,setIsRightPanel}:{info:any,rightPanel:boolean,setIsRightPanel:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const router = useRouter()
  const handleVideoCall = () => {
    const id = uuid();
    const k = process.env.NEXT_PUBLIC_SK!;
    localStorage.setItem("idRoom", id);
    const url = `/room/${id}?role=ch&&l=${endCode(info.user.map((u: any) => u.idUser), k)}`;
    const urlEmit = `/room/${id}?role=u&&l=${endCode(info.user.map((u: any) => u.idUser), k)}`;
    //socket.emit("video_call", { idChat: info && info._id, link: urlEmit });
    router.replace('room');
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
        <Video className="w-8 h-8 text-white cursor-pointer mx-2" />
        <PanelRight onClick={() => setIsRightPanel(!rightPanel)} className="w-7 h-7 text-white cursor-pointer" />
      </div>
    </div>
};

export default ChatHeader;
