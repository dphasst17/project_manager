import { EmptyMessage, MessageComponent } from "./message"
import { isToday } from "@/lib/handle"
import { Chat } from "@/@types/chat"
import { useEffect,useState } from "react"
import {convertDataChat} from "@/lib/convert"
const ChatBody = ({data,memberData,employee,setReply,messageStartRef,messagesEndRef,handleScroll,handleScrollToReply}:
{
  data:any,memberData:any,employee:any,setReply:React.Dispatch<React.SetStateAction<Chat | null>>
  messageStartRef:React.RefObject<HTMLDivElement | null>,messagesEndRef:React.RefObject<HTMLDivElement | null>,handleScroll:() => void
  handleScrollToReply:(id:string) => void
}) => {
  const [dataChat,setDataChat] = useState<{date:string,data:Chat[]}[] | null>(null)
  useEffect(() => {
    data && setDataChat(convertDataChat(data))
  },[data])
  return <div ref={messageStartRef} onScroll={handleScroll} className="w-full h-[72vh] bg-zinc-800 rounded-md flex flex-col overflow-y-auto p-2">
      {dataChat && dataChat.length === 0 && <EmptyMessage />}
      {dataChat && dataChat.map((d:any) => <div key={d.date} className="w-full h-auto flex flex-col my-2">
        <div className="w-full px-1 text-center text-xs text-zinc-100">{isToday(d.date)}</div>
        {d.data.map((item:Chat) =>
          employee && <MessageComponent key={item._id} 
          isCurrentUser={item.senderId === employee.employee_id} 
          chat={item}
          replayContent={item.replyContent}
          name={memberData && memberData.filter((d:any) => d.id === item.senderId)[0]?.name || "You"}
          setReply={setReply}
          handleScrollToReply={handleScrollToReply}
        />
        )}
      </div> 
      )}
      <div ref={messagesEndRef} />
    </div>

}

export default ChatBody
