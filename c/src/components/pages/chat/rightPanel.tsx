import {Channel, Images} from "@/@types/chat"
import { Hash, Images as ImagesIcon, Users } from "lucide-react"
import { useState } from "react"
import { getImagesByChannelId } from "@/api/chat"
import ImagesDialog from "./dialog/image"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const ChatRightPanel = ({info,dataImages,setDataImages}:
{
  info:Channel,dataImages:{total:number,remaining:number,data:Images[] | null},
  setDataImages:React.Dispatch<React.SetStateAction<{total:number,remaining:number,data:Images[] | null}>>
}) => {
  const [tag,setTag] = useState<"member" | "media">("member")
  const [url,setUrl] = useState<string>("")
  const tagData = [
    {
      name:"Member",
      value:"member",
      count:info.members.length,
      icon:<Users className="h-4 w-4 text-white" />
    },
    {
      name:"Media",
      value:"media",
      count:dataImages.total,
      icon:<ImagesIcon className="h-4 w-4 text-white" />
    }
  ]

  const handleLoadMore = async() => {
    const limit = 20
    const skip = dataImages.total - dataImages.remaining
    const res = await getImagesByChannelId(info._id!,limit,skip)
    if(res.status !== 200) return
    setDataImages({
      total:dataImages.total,
      remaining:dataImages.remaining - res.data.data.length,
      data:res.data.data
    })
  }
  return <div className="w-full h-full rounded-md bg-zinc-800">
    {/*Channel info*/}
    <div className="info w-full h-[10%] flex items-center justify-start">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg mx-2">
        <Hash className="h-6 w-6 text-white" />
      </div>
      <div className="flex flex-col mx-2">
        <div className="text-white text-2xl font-semibold">#{info.name}</div>
        <div className="text-zinc-400 text-sm">{info.members.length} members</div>
      </div>
    </div>
    {/**/}
    <div className="tag w-full h-[5%] grid grid-cols-2 gap-2 p-1">
      {tagData.map((item) => {
        return <div key={item.value} onClick={() => setTag(item.value as "member" | "media")}
        className={`h-full flex items-center justify-center hover:bg-zinc-700 transition-all cursor-pointer rounded-md ${tag === item.value ? 'bg-zinc-700' : 'bg-zinc-800'}`}>
          {item.icon} &nbsp; {item.name} ({item.count})
        </div>
      })}
    </div>
    {/**/}
    <div className="w-full h-[85%]">
      {tag === "member" && <div className="w-full h-full grid grid-cols-1 gap-2 content-start px-2">
        {info.members.map((item:any) => 
          <div key={item.id} className="w-full h-10 flex items-center justify-start">
            <div className="avatar w-10 h-10 bg-white rounded-full">
              <img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="img" width={100} height={100} className="w-full h-full object-cover rounded-md" />
            </div>
            <div className="flex flex-col mx-2">
              <div className="text-white text-sm font-semibold">{item.first_name} {item.last_name}</div>
              <div className="text-zinc-400 text-xs">{item.email}</div>
            </div>
          </div>  
        )}       
      </div>}
      {tag === "media" && <div className="w-full h-full flex flex-wrap content-start justify-center">
        <div className="w-full h-[90%] flex flex-wrap content-start">
          {dataImages.data && dataImages.data.map((item:Images) =>
          <AlertDialog key={item._id!} open={url === item.url} onOpenChange={(isOpen) => setUrl(isOpen ? item.url : "")}>
            <AlertDialogTrigger asChild>
              <img src={item.url} alt="img"
              className="w-35 h-35 object-cover rounded-md m-1" />
            </AlertDialogTrigger>
              <ImagesDialog url={item.url} setUrl={setUrl} />
          </AlertDialog>
          )}
          {dataImages.remaining > 0 && <div className="w-full h-15 p-2 flex items-center justify-center">
            <div onClick={() => handleLoadMore()} className="w-full h-10 flex items-center justify-center bg-zinc-800 rounded-md text-white cursor-pointer hover:bg-zinc-700 transition-all">Load more</div>
          </div>}
        </div>
      </div>}
    </div>

  </div> 
}
export default ChatRightPanel
