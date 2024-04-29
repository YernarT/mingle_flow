// Types
import type { I_Response } from "~/types/api";
import type { I_Project, I_ProjectContributor } from "~/types/project";

// Utils
import _fetch from "~/service/fetch";

export const API_FetchProjectList = (
  params = {}
): Promise<I_Response<I_Project[]>> => _fetch.get("/project/", params);

export const API_FetchProject = (
  projectId: number
): Promise<I_Response<I_Project>> => _fetch.get(`/project/${projectId}/`);

export const API_CreateProject = (
  payload: object
): Promise<I_Response<I_Project>> => {
  // @ts-ignore
  payload.contributorList = payload.contributorList.map(
    (contributor: I_ProjectContributor) => contributor.id
  );

  return _fetch.post("/project/", payload);
};
