'use client'
import { createContext, useEffect, useState } from "react";
import { getToken } from "@/libs/cookie";
import { useEmployeeStore } from "@/stores/employee";
export const AppContext = createContext<any>({});
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const {employee} = useEmployeeStore()
  const [isLog, setIsLog] = useState(false);
  const [channel,setChannel] = useState<any>([])
  const [isMeeting,setIsMeeting] = useState<string | null>(null)
  const [onMeeting,setOnMeeting] = useState<boolean>(false)
  const isAdmin = employee?.author == import.meta.env.VITE_IS_ADMIN
  const isManager = employee?.author == import.meta.env.VITE_IS_MANAGER

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        setIsLog(true);
      }
    }
    checkAuth()
  },[])
    return (
        <AppContext.Provider value={{
            isLog, setIsLog,
            isAdmin,isManager,
            channel,setChannel,
            isMeeting,setIsMeeting,
            onMeeting,setOnMeeting
        }}>
            {children}
        </AppContext.Provider>
    )
}

