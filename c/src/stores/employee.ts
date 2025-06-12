import {create} from 'zustand';
import {Employees} from '@/@types/employee';
interface EmployeeStore {
  employee: Employees| null;
  setEmployee: (employee: Employees | null) => void;
  role:number | null,
  setRole: (role:number) => void
  adminEmployee: any | null;
  setAdminEmployee: (adminEmployee: any) => void
  team:any | null,
  setTeam: (team:any) => void
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employee: null,
  setEmployee: (employee) => set({employee}),
  role:null,
  setRole: (role) => set({role}),
  adminEmployee: null,
  setAdminEmployee: (adminEmployee) => set({adminEmployee}),
  team: null,
  setTeam: (team) => set({team})
}));
