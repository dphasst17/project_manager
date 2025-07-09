import { AlertDialogContent, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router"
import { useSocket } from "@/hooks/socket"
import { v4 as uuid } from "uuid"
import { useState } from "react"
const PublicMeetingDialog = () => {
  const [title,setTitle] = useState<string>("")
  const socketRef = useSocket()
  const navigate = useNavigate();
  const handleCreatePublicMeeting = () => {
    if(!title) return
    const id = uuid()
    const url = `/room/${id}`
    socketRef.current?.emit("set_public_meeting", {id: id, title: title, url: url });
    navigate(url);
    return;
  }

  return <AlertDialogContent>
    <AlertDialogTitle>Create Public Meeting</AlertDialogTitle>
    <div className="w-[300px] h-auto max-h-[90vh] flex items-center justify-center">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
        placeholder="Title" className="w-full h-[30px] p-2 border boder-solid rounded-md object-contain" />
    </div>
    <AlertDialogFooter>
      <AlertDialogAction onClick={() => handleCreatePublicMeeting()} className="bg-green-500 bg-green-600 border-none cursor-pointer">
        Create
      </AlertDialogAction> 
      <AlertDialogCancel className="bg-red-500 bg-red-600 border-none cursor-pointer">Close</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default PublicMeetingDialog
