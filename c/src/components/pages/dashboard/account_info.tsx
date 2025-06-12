'use client'
import {useEmployeeStore} from "@/stores/employee";
import {Input} from "@/components/ui/input";
import {AlertDialog,AlertDialogTrigger} from "@/components/ui/alert-dialog";
import PasswordDiaLog from "./dialog/password";
import { useState } from "react";
const AccountInfo = () => {
  const {employee} = useEmployeeStore()
  const [isDialog,setIsDialog] = useState(false)
  return <div className="account-info w-full h-full col-span-2">
      <div className="w-full h-full grid grid-cols-2 gap-y-4 gap-x-2 text-white">
        <Input
          type="text"
          defaultValue={employee?.first_name || ''}
          readOnly
          placeholder="First Name"
        />
        <Input
          type="text"
          defaultValue={employee?.last_name || ''}
          readOnly
          placeholder="Last Name"
        />
        <Input
          type="text"
          defaultValue={employee?.email || ''}
          readOnly
          placeholder="Email"
          className="col-span-2"
        />
        <Input
          type="text"
          defaultValue={employee?.role || ''}
          readOnly
          placeholder="Role"
          className="col-span-1"
        />
        <AlertDialog open={isDialog} onOpenChange={() => setIsDialog(!isDialog)}>
          <AlertDialogTrigger className="btn_create text-white cursor-pointer">
            Change Password
          </AlertDialogTrigger>
          <PasswordDiaLog setIsOpen={setIsDialog} />
        </AlertDialog>
      </div>
  </div>
};

export default AccountInfo;
