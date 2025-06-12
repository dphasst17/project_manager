"use client";
import { AppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLog } = useContext(AppContext);
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof isLog === "undefined") return;

    if (!isLog) {
      router.replace("/auth");// dùng replace thay vì push để không lưu lại lịch sử
      setChecking(false)
    }else{
      setChecking(false)
    }
  }, [isLog]);

  if (checking) return <div>Đang kiểm tra đăng nhập...</div>;
  return <>{children}</>;
};

export default PrivateRoute;

