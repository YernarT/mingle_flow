import type { I_User } from "@/types/user";

export type T_ProjectStatus = 0 | 1 | 2 | 3;

export interface I_ProjectContributor extends I_User {
  project: number;
  canModifyTask: boolean;
  joinTime: string;
}

export interface I_Project {
  id: number;
  name: string;
  description: string;
  status: T_ProjectStatus;
  creator: I_User;
  createTime: string;
  members: I_ProjectContributor[];
}
