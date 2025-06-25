"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "./resizable-navbar";
import { useState,use, useEffect } from "react";
import { usePathname,useRouter } from 'next/navigation'
import { remove } from "@/lib/cookie";
import { useEmployeeStore } from "@/stores/employee";
import {ApiContext} from "@/contexts/api";
import {AppContext} from "@/contexts/app"
import Loader from "./loading";
import { useTaskStore } from "@/stores/task";
import { useProjectStore } from "@/stores/project";

const LayoutNavbar = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isManager } = use(AppContext);
  let navItems = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "Chat",
      link: "/chat",
    },
    {
      name: "Contact",
      link: "/",
    }
  ];
  if (!isAdmin && !isManager) {
    navItems.splice(1, 0, {
      name: "Task",
      link: "/task",
    });
  }
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {isPending} = use(ApiContext)
  const {employee,setEmployee,setAdminEmployee} = useEmployeeStore()
  const {setTask,setStatusTask} = useTaskStore();
  const {setProject,setEmployeeProject} = useProjectStore();
  const {setIsLog} = use(AppContext);
  const pathName = usePathname();
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const handleSignOut = () => {
    setEmployee(null)
    setAdminEmployee(null)
    setTask(null)
    setStatusTask(null)
    setProject(null)
    setEmployeeProject(null)
    setIsLog(false)
    remove("pm-t")
    router.push("/auth")
  }
  useEffect(() => {
    if(windowWidth >= 1424){
      setIsMobileMenuOpen(false)
    }else{
      setIsMobileMenuOpen(true)
    }
  },[])
  return !isPending ? <div className="relative w-full">
      {pathName !== "/auth" && <Navbar>
        {/* Desktop Navigation */}
        {windowWidth >= 1424 && <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Hello {employee?.first_name} {employee?.last_name}</NavbarButton>
            <NavbarButton onClick={handleSignOut} variant="primary">Sign Out</NavbarButton>
          </div>
        </NavBody>}
        {isMobileMenuOpen && <div className="mobile fixed inset-0 w-full h-screen z-50 bg-black flex items-center justify-center">
          Please open the app in a bigger screen
        </div>}
        {/* Mobile Navigation */}
        {/*<MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <div
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </div>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Signin
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Account
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>*/}
      </Navbar>}
 
      <div>{children}</div>
      {/* Navbar */}
    </div>
    : <Loader/>
  }

export default LayoutNavbar
