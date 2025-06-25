'use client'
import { createContext, useEffect, useState } from "react";
import { getToken } from "@/lib/cookie";
import { useEmployeeStore } from "@/stores/employee";
export const AppContext = createContext<any>({});
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const {employee} = useEmployeeStore()
  const [isLog, setIsLog] = useState(false);
  const [channel,setChannel] = useState<any>([])
  const isAdmin = employee?.author == process.env.NEXT_PUBLIC_IS_ADMIN
  const isManager = employee?.author == process.env.NEXT_PUBLIC_IS_MANAGER

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

        }}>
            {children}
        </AppContext.Provider>
    )
}
