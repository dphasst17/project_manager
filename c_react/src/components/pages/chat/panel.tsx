import { Button } from "@/components/ui/button_radix"
import { Input } from "@/components/ui/input"
import { Smile,Send,Image,ImageMinus,AtSign } from "lucide-react"
import { useState } from "react"
import { imagesUpload } from "@/api/file"
import { resizeImages } from "@/libs/handle"
import type { Chat,Channel } from "@/@types/chat"
import {getToken} from "@/libs/cookie"
import { createChat } from "@/api/chat"
import { useSocket } from "@/hooks/socket"
import { X,User } from "lucide-react"
const PanelChat = ({info,data,id,reply,setReply,setData}
  :{
    info:Channel
    data:{date:string,data:Chat[]}[]
    id:string,reply:Chat | null,
    setReply: React.Dispatch<React.SetStateAction<Chat | null>>
    setData:React.Dispatch<React.SetStateAction<any[]>>
  }) => {
  const socketRef = useSocket()
  const [message,setMessage] = useState<string>("")
  const [images,setImages] = useState<File[]>([])
  const [tag,setTag] = useState<boolean>(false)
  const [tagSelected,setTagSelected] = useState<{id:string,name:string}[]>([])
  
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value === "") setTagSelected([])

    const findTagLen = e.target.value.match(/@\w+/g)?.length
    findTagLen && (tagSelected.length > findTagLen) && setTagSelected(tagSelected.slice(0,findTagLen))
    const value = e.target.value
    const newChar = value.slice(-1)
    newChar === "@" ? setTag(true) : setTag(false)
    setMessage(e.target.value)
  }
  const setImagesList = (e:React.ChangeEvent<HTMLInputElement>) => {
    const arrFile = Array.from(e.target.files!);
    setImages([...images,...arrFile])
  }
  const handleRemoveImage = (index:number) => {
    const arr = [...images]
    arr.splice(index,1)
    setImages(arr)
  }
  const handleUploadImages = async():Promise<any> => {
    if(images.length === 0) return
    const resize = await resizeImages(images)
    const formData = new FormData()
    resize.forEach((item) => {
      formData.append('files',item)
    })
   const res = await imagesUpload(formData)
   if(res.status !== 201) return
   return res.data
  }
  const handleUploadMessage = async() => {
    const arrImages:{url:string}[] = images.length > 0 && await handleUploadImages()
    const dataImages = arrImages && arrImages.map((i:any) => ({
      channelId:id,
      url:i.url
    }))
    const dataChat = {
      channelId: id,
      content: message,
      replyTo: reply && reply._id,
      reaction:[]
    }
    let dataInsert:any = {
      chat: dataChat,
    }
    if(images.length > 0) {
      dataInsert.images = dataImages 
    }
    const token = await getToken()
    const res = token && await createChat(token,dataInsert)
    if(res.status !== 201) return
    let dataRes = res.data
    if(dataImages) {
      dataRes.images = dataImages
    }
    socketRef.current?.emit("insert_message",dataRes)
    setData([...data,dataRes])
    setMessage("")
    setImages([])
    setReply(null)
  }
  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>,) => {
    if (e.key === "Backspace") {
      const i = e.currentTarget.selectionStart ?? 0;
      const match = message.slice(0, i).match(/@\w+$/);
      if (!match) return;

      const tag = match[0].slice(1);
      setMessage(
        message.slice(0, i - match[0].length) + message.slice(i)
      );
      setTagSelected(t => t.filter(u => u.name !== tag));
      e.preventDefault();
    }
    if(e.key === "Enter") {
      handleUploadMessage()
    }
  }
  return <div className="panelChat w-full h-20 flex flex-col">
      {images.length > 0 &&<div className={`images_preview absolute left-0 rounded-md ${reply ? 'bottom-30' : 'bottom-22'} w-full h-[120px] mx-auto bg-zinc-700`}>
        <div className="w-full h-full flex items-center space-x-2 px-2">
          {images.map((item,index) => <div key={item.name} className="relative flex items-center space-x-2">
            <div onClick={() => handleRemoveImage(index)} 
              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 rounded-md cursor-pointer">
              <ImageMinus className="h-4 w-4 text-white" />
            </div>
            <img key={item.name} src={URL.createObjectURL(item)} className="w-20 h-25 object-cover cursor-pointer rounded-md mx-2" alt="img" />
          </div>)}
        </div>
      </div>}
      {
        reply && <div className={`reply absolute left-0 rounded-md bottom-22 w-full ${reply.images && reply.images.length > 0 ? 'h-[50px]' : 'h-[35px]'} flex mx-auto bg-zinc-700 p-1`}>
           <div className="w-[98%] h-full flex flex-col justify-center px-2 text-sm rounded-md text-white">
              <span>{reply.images && reply.images.length > 0 && `${reply.images.length} images`}</span>
              <span>Message: {reply.content || "Images"}</span>
            </div>
            <div className="w-[2%] h-full bg-red-500 rounded-md flex items-center justify-center">
              <X className="h-4 w-4 text-white cursor-pointer" onClick={() => setReply(null)} />
            </div>
        </div>
      }
      {/*Tag*/}
      {tag && <div className="absolute left-0 bottom-22 w-full h-auto min-h-[50px] flex rounded-md mx-auto border border-solid bg-zinc-950 p-2">
        <div className="w-[98%] h-full grid grid-cols-10 gap-2 px-2 text-sm rounded-md text-white">
          {info.members.map((item) => <div key={item.id}
            onClick={() => {
              if(tagSelected.includes(item.employee_id)) return
              setMessage(`${message}${item.first_name}${item.last_name}`); 
              setTag(false);
              setTagSelected([...tagSelected,{id:item.id,name:`${item.first_name}${item.last_name}`}])
            }}
            className={`hover:bg-gray-800 ${tagSelected.filter(u => u.id === item.id).length > 0 ? 'bg-gray-800' : 'bg-zinc-500'} cursor-pointer rounded-md grid grid-cols-3 p-1 transition-all`}>
            <div className="w-5 h-5 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="col-span-2 truncate">{item.first_name} {item.last_name}</span>
          </div>)}
        </div>
      </div>}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" type="button">
            <Smile className="h-5 w-5" />
          </Button>
          <label>
            <Image className="w-5 h-5 cursor-pointer" />
            <input
              multiple onChange={(e) => setImagesList(e)}
              type="file" accept="image/*" className="hidden"
            />
          </label>
          <Button onClick={() => setTag(!tag)} variant="ghost" size="icon" type="button" className="cursor-pointer">
            <AtSign className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => handleChange(e)}
            placeholder={"Type a message to your team..."}
            className="flex-1"
            onKeyDown={(e:any) => handleKeyDown(e)}
          />
          <Button onClick={() => handleUploadMessage()} className="bg-blue-500 p-1 rounded-md cursor-pointer mx-1" type="submit" size="icon">
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div> 
}
export default PanelChat
