'use client'
import { useEffect, useState,useRef } from "react"
import PanelChat from "./panel"
import { Chat, Images } from "@/@types/chat"
import { useEmployeeStore } from "@/stores/employee"

import { getChatByChannelId, getImagesByChannelId} from "@/api/chat"
import ChatHeader from "./header"
import ChatBody from "./body"
import ChatRightPanel from "./rightPanel"
import { useSocket } from "@/hooks/socket"

const ChatDetail = ({id,info}:{id:string,info:any}) => {
  const socketRef = useSocket()
  const {employee} = useEmployeeStore()
  const [isRightPanel,setIsRightPanel] = useState<boolean>(false)
  const [reply,setReply] = useState<Chat | null>(null)
  const [data,setData] = useState<any>([])
  const [dataImages,setDataImages] = useState<{total:number,remaining:number,data:Images[] | null}>({
    total:0,
    remaining:0,
    data:null
  })
  const [pageChat,setPageChat] = useState<{total:number,remaining:number}>({
    total:0,
    remaining:0
  })
  const [memberData,setMemberData] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageStartRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    const container = messageStartRef.current;
    if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
    }
  };

  useEffect(() => {
    const fetchDataChat = async() => {
      if(!id) return
      const [chat,images] = await Promise.all([
        getChatByChannelId(id,20,0),
        getImagesByChannelId(id,20,0)
      ])

      if(chat.status !== 200) return

      if(images.status === 200) {
        setDataImages({
          total:images.data.total,
          remaining:images.data.total - images.data.data.length,
          data:images.data.data
        })
      }
      setData(chat.data.data)
      setPageChat({
        total:chat.data.total,
        remaining:chat.data.total - chat.data.data.length
      })
      scrollToBottom()
    }
    fetchDataChat()
    setMemberData(info.members.map((d:any) => ({id:d.id,name:`${d.first_name} ${d.last_name}`})))
  },[id,info])
  //scroll to bottom
  useEffect(() => {
    if(socketRef.current){
      socketRef.current.emit('join_channel',{channel:id})
      socketRef.current.on('join_channel',(data:any) => {
        console.log(data) 
      })
      socketRef.current.on('message',(dataChat:any) => {
        if(employee?.employee_id === dataChat.senderId) return
        const currentDate = (dataChat.createdAt).split("T")[0]
        const dataByDate = data && data.filter((item:{date:string,data:Chat[]}) => item.date === currentDate)
        if(dataByDate.length === 0) {
          setData((prev:any) => [...prev,{date:currentDate,data:[dataChat]}])
          return
        }
        setData((prev:any) => prev.map((item:{date:string,data:Chat[]}) => item.date === currentDate ? {...item,data:[...item.data,dataChat]} : item))
        scrollToBottom();
      })
      return () => {
        socketRef.current?.off('join_channel')
        socketRef.current?.off('message')
      }
    }
   //socket.emit('join_channel',id) 
  },[id,socketRef,data,employee])

  const handleScroll = async() => {
    if(messageStartRef.current) {
      const { scrollTop, scrollHeight } = messageStartRef.current;
      if (scrollTop === 0) {
        const previousHeight = scrollHeight;
        //load older message
        const unread = pageChat.remaining || 0
        const skip = pageChat?.total! - unread
        if(unread === 0) return
        const res = await getChatByChannelId(info._id,20,skip)
        if(res.status !== 200) return
        setData((prev:any) => [...res.data.data,...prev])
        setPageChat({
          total:pageChat?.total || 0,
          remaining:pageChat?.remaining! - res.data.data.length || 0
        })
        //update location scroll
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (messageStartRef.current) {
                const newHeight = messageStartRef.current.scrollHeight;
                messageStartRef.current.scrollTop = newHeight - previousHeight;
              }
            });
          });
        //
      }
    }
  }
  const handleScrollToReply = async(id:string) => {
    const scrollToMessage = () => {
      const messageElement = document.getElementById(id);
      const container = messageStartRef.current;

      if (messageElement && container) {
        const scrollOffset = messageElement.offsetTop - container.offsetTop;

        container.scrollTo({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    };    
    //Check message is exist
    const includeCurrentChat = data && data.filter((d: Chat) => d._id === id);
    if (includeCurrentChat.length > 0) {
      scrollToMessage();
    }else{
      const limit = 20
      let isIncludeData = false;
      let read = pageChat.total - pageChat.remaining
      let unread = pageChat.remaining
      let arrResult:Chat[] = []
      let skip = pageChat?.total! - unread
      while (!isIncludeData && unread > 0) {
        const res = await getChatByChannelId(info._id,limit,skip)
        if(res.status !== 200) return

        arrResult = [...res.data.data,...arrResult]
        read = read + res.data.data.length
        unread = pageChat.total - read
        skip = read
        isIncludeData = res.data.data.filter((d:Chat) => d._id === id).length > 0
      }
      if(isIncludeData) {
        setData([...arrResult,...data])
        setPageChat({
          total:pageChat?.total || 0,
          remaining:pageChat?.remaining! - arrResult.length || 0
        })
        setTimeout(() => scrollToMessage(), 100);
      }
    }

  }
  return <div className="col-span-5 relative h-full flex py-4 overflow-hidden">
    <div className={`relative ${isRightPanel ? "w-4/5" : "w-full"} h-full flex flex-col transition-all duration-500`}>
      <ChatHeader info={info} rightPanel={isRightPanel} setIsRightPanel={setIsRightPanel} />
      <ChatBody data={data} memberData={memberData} employee={employee} setReply={setReply} 
        messageStartRef={messageStartRef} messagesEndRef={messagesEndRef} handleScroll={handleScroll} handleScrollToReply={handleScrollToReply}
      />
      <PanelChat data={data} id={info._id} reply={reply} setReply={setReply} setData={setData}  />
    </div>
    <div className={`${isRightPanel ? "w-1/5 px-1" : "w-0 px-0 opacity-0"} h-full transition-all duration-500`}>
      <ChatRightPanel info={info} dataImages={dataImages} setDataImages={setDataImages} />
    </div>
  </div>
}
export default ChatDetail
