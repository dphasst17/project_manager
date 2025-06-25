import { PanelRight } from "lucide-react";
const ChatHeader = ({info,rightPanel,setIsRightPanel}:{info:any,rightPanel:boolean,setIsRightPanel:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return <div className="headerChat w-full h-20 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {info &&<div className="flex flex-col">
          <div className="text-white text-2xl font-semibold">#{info.name}</div>
          <div className="text-zinc-400 text-sm">{info.members.length} members</div>
        </div>}
      </div>
      <div className="flex justify-center items-center">
        <PanelRight onClick={() => setIsRightPanel(!rightPanel)} className="w-7 h-7 text-white cursor-pointer" />
      </div>
    </div>
};

export default ChatHeader;
