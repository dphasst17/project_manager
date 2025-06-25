import { MessageCircle,MessageSquareReply } from "lucide-react"
import { convertDate } from "@/lib/convert"
import { Chat, Images } from "@/@types/chat"
import { useState } from "react"
import ImagesDialog from "./dialog/image"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
const MessageComponent = ({isCurrentUser,name,chat,imageUrl,replayContent,setReply,handleScrollToReply}:
{
  isCurrentUser:boolean,name:string,chat:Chat,imageUrl?:string,replayContent?:any,
  setReply:React.Dispatch<React.SetStateAction<Chat | null>>,
  handleScrollToReply:(id:string) => void
}) => {
  const [url,setUrl] = useState<string>("")
  const emptyUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  return <div className={`w-full h-auto min-h-[70px] flex items-center cursor-pointer my-2
    ${isCurrentUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'}`}>
    <div className="avatar w-10 h-10 bg-white rounded-full">
      <img src={imageUrl || emptyUrl} alt="img" width={100} height={100} className="w-full h-full object-cover rounded-md" />
    </div>
    <div className={`message w-auto h-auto min-h-[30px] rounded-md p-2 mx-1`}>
      <div className="grid grid-cols-1">
          <div className="w-full px-1 text-sm font-semibold">{name}</div>
          {chat.images && chat.images.length > 0 && <div className="w-full my-1">
            <div className="w-full min-h-[20px] flex items-center text-sm rounded-md text-white">
              {chat.images.map(
                (item:Images) => <AlertDialog key={item._id!} open={url === item.url} onOpenChange={(isOpen) => setUrl(isOpen ? item.url : "")}>
                  <AlertDialogTrigger asChild>
                    <img src={item.url} alt="img"
                      className="w-35 h-35 object-cover rounded-md m-1" />
                  </AlertDialogTrigger>
                  <ImagesDialog url={item.url} setUrl={setUrl} />
                </AlertDialog>
              )}
            </div>
          </div>}
          <div className="w-full my-1">
            {replayContent && <div onClick={() => handleScrollToReply(replayContent._id)} 
            className="w-full min-h-[20px] flex items-center px-2 text-sm rounded-md bg-gray-400 text-white">
              {replayContent.content ? replayContent.content : "Image"}
            </div>}
          </div>
          <div className="w-auto grid grid-cols-1">
            <div id={chat._id} className={` flex items-center ${isCurrentUser ? 'justify-end' : 'justify-start'} text-sm rounded-md`}>
              <span className={`min-w-[30px] min-h-[40px] px-2 rounded-md flex items-center justify-center
              ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-zinc-950 text-white'}}`}>
                {chat.content}
              </span>
            </div>
            <div className={`flex ${isCurrentUser ? 'flex-row' : 'flex-row-reverse'} items-center justify-end`}>
              {!replayContent && <MessageSquareReply onClick={() => setReply(chat)} className="h-5 w-5 my-1 text-muted-foreground" />}
              <span className="px-1 text-xs text-zinc-100">{convertDate(chat.createdAt,'time')}</span>
            </div>
          </div>
          
        </div>
    </div>
  </div>
}
const EmptyMessage = () => {
  return <div className="my-auto text-zinc-500 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
            Start the conversation by sending your first message to Contact
            Name.
        </p>
    </div>
}

export {MessageComponent,EmptyMessage}

