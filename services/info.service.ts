import { instanceWithToken } from "./axios.service"

export interface IUpdateInformation {
  phoneNumber: string

  mail: string

  address: string
}

export const GET_INFOS = async () => {
  return instanceWithToken.get("/api/v1/information")
}

export const UPDATE_INFOS = async (id: number, data: IUpdateInformation) => {
  return instanceWithToken.patch("/api/v1/information/" + id, data)
}

