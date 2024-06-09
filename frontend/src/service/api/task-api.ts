// Types
import type { I_Response } from "~/types/api";
import type { I_Task, I_Task_Create } from "~/types/task";

// Utils
import _fetch from "~/service/fetch";

export const API_FetchTaskList = (
  projectId: number
): Promise<
  I_Response<{
    backlog: I_Task[];
    analyze: I_Task[];
    develop: I_Task[];
    test: I_Task[];
    finish: I_Task[];
  }>
> => _fetch.get(`/task/?project=${projectId}`);

export function API_CreateTask(
  payload: I_Task_Create
): Promise<I_Response<I_Task>> {
  return _fetch.post("/task/", payload);
}

export function API_UpdateTask(
  taskId: number,
  payload: Partial<I_Task>
): Promise<I_Response<I_Task>> {
  return _fetch.patch(`/task/${taskId}/`, payload);
}
