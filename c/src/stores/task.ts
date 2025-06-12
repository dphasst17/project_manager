import {AdminTask, Tasks} from '@/@types/task';
import {create} from 'zustand';

interface ResAdminTask{
  total:number,
  limit:number,
  page:number,
  totalPage:number
  data:AdminTask[]
}
interface EmployeeTask{
  total:number,
  limit:number,
  page:number,
  totalPage:number,
  task?:Tasks[]
  data:Tasks[]
}
interface TaskStore {
  task: ResAdminTask | null;
  setTask: (task: ResAdminTask | null) => void;
  statusTask:{completed:EmployeeTask,in_progress:EmployeeTask,not_started:EmployeeTask} | null;
  setStatusTask: (statusTask:{completed:EmployeeTask,in_progress:EmployeeTask,not_started:EmployeeTask} | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  task: null,
  setTask: (task) => set({task}),
  statusTask: null,
  setStatusTask: (statusTask) => set({statusTask}),
}));
