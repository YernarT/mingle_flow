import type { I_User } from "@/types/user";

export type T_ProjectStatus = 0 | 1 | 2 | 3;

export interface I_ProjectContributor extends I_User {
  id: number;
  project: number;
  canModifyTask: boolean;
  joinTime: string;
  user: I_User;
}

export interface I_Project {
  id: number;
  name: string;
  description: string;
  status: T_ProjectStatus;
  creator: I_User;
  createTime: string;
  progress: number;
  taskCount: number;
  contributorCount: number;
  contributorList: I_ProjectContributor[];
}
