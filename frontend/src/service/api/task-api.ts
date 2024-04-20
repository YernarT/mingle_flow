// Types
import type { I_Response } from "~/types/api";
import type { I_Task } from "~/types/task";

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
