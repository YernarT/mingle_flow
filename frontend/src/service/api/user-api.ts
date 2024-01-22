// Types
import type { I_Response } from "~/types/api";
import type { I_User } from "~/types/user";

// Utils
import _fetch from "~/service/fetch";

export const API_Login = (data: {
  email: string;
  password: string;
}): Promise<I_Response<I_User>> => _fetch.post("/auth/login/", data);

export const API_UpdateInfo = (
  userId: number,
  data: {
    fullname?: string;
    email?: string;
  }
): Promise<I_Response<I_User>> => _fetch.patch(`/user/${userId}/`, data);

export const API_ChangePassword = (data: {
  password: string;
  newPassword: string;
}): Promise<I_Response<I_User>> => _fetch.post(`/auth/change-password/`, data);

export const API_GetUserList = (): Promise<I_Response<I_User[]>> =>
  _fetch.get("/user/");

export const API_DeleteUser = (userId: number): Promise<I_Response<null>> =>
  _fetch.delete(`/user/${userId}/`);
