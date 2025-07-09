'use client'
import ListChannel from "@/components/pages/chat/listChannel"
import { useState } from "react"
import ChatDetail from "@/components/pages/chat/chat"
import {Channel} from "@/@types/chat"
const Chat = () => {
  const [id,setId] = useState<string | null>(null)
  const [info,setInfo] = useState<Channel | null>(null)

  return <div className="w-full h-[94vh] grid grid-cols-6 px-3 py-1">
    <ListChannel setId={setId} setInfo={setInfo} />
    {id && <ChatDetail id={id} info={info}/>}
  </div>
}
export default Chat;

