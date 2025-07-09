import { AlertDialogContent, AlertDialogFooter, AlertDialogTitle,AlertDialogAction,AlertDialogCancel } from "@/components/ui/alert-dialog"
import {getToken} from "@/libs/cookie"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Input } from "@/components/ui/input"
import {updateAuth} from "@/api/auth"
const PasswordDiaLog = ({setIsOpen}:{setIsOpen:React.Dispatch<React.SetStateAction<boolean>>}) => {
const {register,handleSubmit} = useForm()
const onSubmit = async (data:any) => {
  const isMatchPassword = data.password === data.confirm_password
  if(!isMatchPassword) return toast.error("Password does not match")
  const token = await getToken()
  if(token){
    const res = token && await updateAuth(token,{current:data.current,new:data.password})  
    if(res.status !== 200) return toast.error("Update Password Failed")
    toast.success("Update Password Success")
    setIsOpen(false)

  }

}
return <AlertDialogContent>
  <AlertDialogTitle>Change Password</AlertDialogTitle>
  <div className="flex flex-col gap-y-2 text-white">
    <Input type="password" placeholder="Current Password" {...register("current")}/>
    <Input type="password" placeholder="Password" {...register("password")}/>
    <Input type="password" placeholder="Confirm Password" {...register("confirm_password")}/>
  </div>
  <AlertDialogFooter>
    <AlertDialogAction className="bg-blue-600 text-white" onClick={handleSubmit(onSubmit)}>Save</AlertDialogAction>
    <AlertDialogCancel className="bg-red-600 border-none text-white" onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
  </AlertDialogFooter>
</AlertDialogContent>

}
export default PasswordDiaLog
