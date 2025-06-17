'use client'
import AccountInfo from "@/components/pages/dashboard/account_info";
import Tasks from "@/components/pages/dashboard/task";
import AdminEmployee from "@/components/pages/dashboard/employee";
import Project from "@/components/pages/dashboard/project";
import {AppContext} from "@/contexts/app";
import { use, useEffect, useState} from "react";
import ProjectDialog from "@/components/pages/dashboard/dialog/project";
import EmployeeDialog from "@/components/pages/dashboard/dialog/employee";
import Statistical from "@/components/pages/dashboard/statistical";
import TeamDialog from "@/components/pages/dashboard/dialog/team";
import Team from "@/components/pages/dashboard/team";
import BtnDialog from "@/components/btn_dialog";

import { analytics } from "@/lib/firebase";

export default function Home() {
  const {isAdmin,isLog} = use(AppContext)
  const [isDialog, setIsDialog] = useState<{project?:boolean,employee?:boolean,budget?:boolean,team?:boolean}>({
    project:false,
    employee:false,
    budget:false,
    team:false
  })
  useEffect(() => {
    if (analytics) {
      console.log("Firebase Analytics ready");
    }
  }, []);
  return isLog && <div className="container mx-auto p-8 pt-24">
      <div className="mb-10 flex flex-wrap justify-start">
        {isAdmin && <>
          <Statistical />
          <BtnDialog title="+ Create Project" 
            isOpen={isDialog.project as boolean} 
            openChange={(isOpen) => setIsDialog({...isDialog,project:isOpen})}
            btnClass="btn_create text-white cursor-pointer"
            Component={ProjectDialog} 
          />
          <BtnDialog title="+ Create Employee"
            isOpen={isDialog.employee as boolean}
            openChange={(isOpen) => setIsDialog({...isDialog,employee:isOpen})}
            btnClass="btn_create text-white cursor-pointer"
            Component={EmployeeDialog} 
          />
          <BtnDialog title="+ Create Team"
            isOpen={isDialog.team as boolean}
            openChange={(isOpen) => setIsDialog({...isDialog,team:isOpen})}
            btnClass="btn_create text-white cursor-pointer"
            Component={TeamDialog} 
          />
          {/*<AlertDialog open={isDialog.budget} onOpenChange={() => setIsDialog({...isDialog,budget:!isDialog.budget})}>
            <AlertDialogTrigger className="btn_create text-white cursor-pointer">
              Add Budget
            </AlertDialogTrigger>
            <EmployeeDialog closeDialog={handleCloseDialog} />
          </AlertDialog>*/}
        </>}

      </div>
      <div className="w-full grid gap-x-10 gap-y-5 grid-cols-7">
        <AccountInfo />
        <Project />
        <Team />
        {isAdmin && <h1 className="text-2xl font-bold">Task</h1>}
        <Tasks />
        {isAdmin && <h1 className="text-2xl font-bold">Employee</h1>}
        <AdminEmployee />
      </div>
  </div>
  ;
}
