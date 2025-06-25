'use client'
import ListChannel from "@/components/pages/chat/listChannel"
import { useState } from "react"
import ChatDetail from "@/components/pages/chat/chat"
import {Channel} from "@/@types/chat"
const Chat = () => {
  const [id,setId] = useState<string | null>(null)
  const [info,setInfo] = useState<Channel | null>(null)

  // next day, i will to create dialog for preview images and add preview group icon in chat header
  // in preview group, i want to show all members and all images in group
  // finally, i will to create feature for video call using zegocloud
  return <div className="w-full h-[94vh] grid grid-cols-6 px-3 py-1">
    <ListChannel setId={setId} setInfo={setInfo} />
    {id && <ChatDetail id={id} info={info}/>}
  </div>
}
export default Chat;

