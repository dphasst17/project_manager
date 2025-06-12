import {create} from 'zustand';

interface ProjectStore {
  project: any | null;
  setProject: (project: any) => void;
  employeeProject: any | null;
  setEmployeeProject: (employeeProject: any) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  setProject: (project) => set({project}),
  employeeProject: null,
  setEmployeeProject: (employeeProject) => set({employeeProject}),
}));

