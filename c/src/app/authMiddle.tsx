'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {getToken} from "@/lib/cookie";

export default function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken()
      if (!token) {
        router.push("/auth");
      }
    }

    checkAuth();
  }, []);

  return children;
}

