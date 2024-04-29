import type { I_User } from "@/types/user";
import type { I_Project } from "@/types/project";

export type T_Filter = "all" | "created" | "assigned";

export type T_TaskPriority = 1 | 2 | 3 | 4;

export type T_TaskStatus = 0 | 1 | 2 | 3 | 4;

export interface I_TaskAttachement {
  id: number;
  uploader: I_User;
  file: string;
  createTime: string;
}

export interface I_TaskComment {
  id: number;
  user: I_User;
  content: string;
  createTime: string;
}

export interface I_Task {
  id: number;
  name: string;
  description: string;
  startTime: string;
  dueTime: string;
  priority: T_TaskPriority;
  status: T_TaskStatus;
  tags: string[];
  finishTime: string;
  project: I_Project;
  creator: I_User;
  worker: I_User | null;
  updateTime: string;
  createTime: string;
  commentList: I_TaskComment[];
  attachementList: I_TaskAttachement[];
}
