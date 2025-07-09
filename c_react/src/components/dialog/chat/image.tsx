import { AlertDialogContent, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog"
const ImagesDialog = ({url,setUrl}:{url:string,setUrl:React.Dispatch<React.SetStateAction<string>>}) => {
  return <AlertDialogContent>
    <AlertDialogTitle>Image</AlertDialogTitle>
    <div className="w-auto max-w-[80vw] h-auto max-h-[90vh] flex items-center justify-center">
      <img src={url} alt={`${url}`} className="w-full h-full object-contain" />
    </div>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setUrl("")} className="bg-red-500 bg-red-600 border-none cursor-pointer">Close</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
}
export default ImagesDialog
