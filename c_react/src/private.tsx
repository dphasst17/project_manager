import { AppContext } from "@/contexts/app";
import { useNavigate } from "react-router";
import { getToken } from "@/libs/cookie";
import React, { useContext, useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLog } = useContext(AppContext);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setChecking(true)
      const token = await getToken();
      if(!token) {
        navigate("/auth")
        setChecking(false)
      }
      setChecking(false)
    }
    checkAuth()
  }, [isLog]);

  if (checking) return <div>Đang kiểm tra đăng nhập...</div>;
  return <>{children}</>;
};

export default PrivateRoute;


