// Types
import type { I_Response } from "~/types/api";
import type { I_Project } from "~/types/project";

// Utils
import _fetch from "~/service/fetch";

export const API_FetchProjectList = (
  params = {}
): Promise<I_Response<I_Project[]>> => _fetch.get("/project/", params);
