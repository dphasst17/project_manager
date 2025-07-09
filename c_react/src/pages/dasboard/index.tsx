import AccountInfo from "@/components/pages/dashboard/account_info";
import Tasks from "@/components/pages/dashboard/task";
import AdminEmployee from "@/components/pages/dashboard/employee";
import Project from "@/components/pages/dashboard/project";
import {AppContext} from "@/contexts/app";
import { use, useState} from "react";
import ProjectDialog from "@/components/dialog/dashboard/project";
import EmployeeDialog from "@/components/dialog/dashboard/employee";
import Statistical from "@/components/pages/dashboard/statistical";
import TeamDialog from "@/components/dialog/dashboard/team";
import Team from "@/components/pages/dashboard/team";
import BtnDialog from "@/components/ui/btn_dialog";
import Time from "@/components/pages/dashboard/time";
import MemberStatistical from "@/components/pages/dashboard/memberStatistical";
import TaskCalendar from "@/components/pages/dashboard/calendar";
//import { analytics } from "@/libs/firebase";
import {ApiContext} from "@/contexts/api";

export default function DashboardPage() {
  const {isAdmin,isLog} = use(AppContext)
  const {isPending} = use(ApiContext)
  const [isDialog, setIsDialog] = useState<{project?:boolean,employee?:boolean,budget?:boolean,team?:boolean}>({
    project:false,
    employee:false,
    budget:false,
    team:false
  })
  return isLog && !isPending && <div className="container min-h-[94vh] mx-auto p-8 pt-24">
      <div className="mb-10 flex flex-wrap justify-start">
        {isAdmin && <>
          <Statistical />
          <BtnDialog title="+ Create Project" 
            isOpen={isDialog.project as boolean} 
            openChange={(isOpen:boolean) => setIsDialog({...isDialog,project:isOpen})}
            btnClass="btn_create text-white cursor-pointer"
            Component={ProjectDialog} 
          />
          <BtnDialog title="+ Create Employee"
            isOpen={isDialog.employee as boolean}
            openChange={(isOpen:boolean) => setIsDialog({...isDialog,employee:isOpen})}
            btnClass="btn_create text-white cursor-pointer"
            Component={EmployeeDialog} 
          />
          <BtnDialog title="+ Create Team"
            isOpen={isDialog.team as boolean}
            openChange={(isOpen:boolean) => setIsDialog({...isDialog,team:isOpen})}
            btnClass="btn_create text-white cursor-pointer"
            Component={TeamDialog} 
          />
        </>}

      </div>
      <div className="w-full grid gap-x-10 gap-y-5 grid-cols-7">
        <Time />
        <AccountInfo />
        <MemberStatistical />
        <Project />
        <Team />
        {isAdmin && <h1 className="text-2xl font-bold">Task</h1>}
        <Tasks />
        {isAdmin && <h1 className="text-2xl font-bold">Employee</h1>}
        <AdminEmployee />
        <TaskCalendar />
      </div>
  </div>
  ;
}

