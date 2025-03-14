import { instanceWithToken } from "./axios.service"

export const GET_VISITS = async () => {
  return instanceWithToken.get("/api/v1/visit")
}

