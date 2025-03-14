import { instanceWithToken } from "./axios.service"

export const LOGIN = async (data: { username: string; password: string }) => {
  return instanceWithToken.post("/api/v1/auth/login", data)
}
export const WHOAMI = async () => {
  return instanceWithToken.get("/api/v1/auth/me")
}

