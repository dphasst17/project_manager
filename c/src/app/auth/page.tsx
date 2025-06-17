'use client'
import { useState,use } from 'react'
import {useForm} from 'react-hook-form'
import { Input } from "@/components/ui/input";
import { ArrowRight, RefreshCw} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signIn } from '@/api/auth'
import { save } from '@/lib/cookie'
import { toast } from 'react-toastify'
import { AppContext } from '@/contexts/app'
const AuthPage = () => {
  const {register,handleSubmit,formState} = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const {setIsLog} = use(AppContext)
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      const res = await signIn(formData.email,formData.password)
      return res
    },
    onSuccess: (data) => {
      if(data.status === 200){
        setIsLog(true)
        save('pm-t',data.data.t,data.data.e)
        router.push('/')
      }
      if(data.status === 401 || data.status === 400){
        toast.error(data.message)
      }
    },
    onError: (error) => {
      console.log(error)
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });
  const onSubmit = (data:any) => {
    setIsLoading(!isLoading)
    mutation.mutate(data)
  }
  return <div className='w-full h-screen flex flex-col justify-center items-center bg-[#1E1E1E]'>
    <h1 className='text-3xl font-bold'>Sign In to Your Account</h1>
    <div className="form w-1/4 mt-10 p-5 grid grid-cols-1 gap-4">
      <div>
        <Input 
          {...register('email',{required:true,pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})} 
          className={`mb-1 border border-input ${formState.errors.email && 'border-red-500'}`} 
          placeholder='Email'
        />
        {formState.errors.email?.type === 'pattern' && <span className='rounded-md bg-red-500 text-[13px] text-white p-1'>Email is invalid</span>}
        {formState.errors.email?.type === 'required' && <span className='rounded-md bg-red-500 text-[13px] text-white p-1'>Email is required</span>}
      </div>
      <div>
        <Input 
          {...register('password',{required:true})} 
          className={`border border-input mb-1 ${formState.errors.password && 'border-red-500'}`}
          type="password"
          placeholder='Password'/>
        {formState.errors.password && <span className='rounded-md bg-red-500 text-[13px] text-white p-1'>Password is required</span>}
      </div>
      <button onClick={handleSubmit(onSubmit)} className='w-2/4 h-[30px] rounded-md flex items-center justify-center cursor-pointer mx-auto bg-gradient-to-r from-violet-800 to-yellow-200 text-md text-zinc-950 font-bold'>
        {!isLoading && <span className='mr-2 transition-all'>Sign In</span>}
        {!isLoading && <ArrowRight className='w-4 h-4 transition-all'/>}
        {isLoading && <RefreshCw className='w-4 h-4 animate-spin'/>}
      </button>
    </div>
  </div>
}
export default AuthPage
