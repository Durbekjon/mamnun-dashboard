import { instanceWithToken } from "./axios.service"

type ServiceType = "edu" | "travel"

interface ICReateService {
  title: string
  imageUrl: string
  description?: string
  type: ServiceType
}

interface IUpdateService extends ICReateService {
  id: number
}

export const GET_COMPANY_SERVICES = async (type?: ServiceType) => {
  return instanceWithToken.get("/api/v1/services" + (type ? `?type=${type}` : ""))
}

export const CREATE_COMPANY_SERVICE = async (data: ICReateService) => {
  return instanceWithToken.post("/api/v1/services", data)
}

export const UPDATE_COMPANY_SERVICE = async (id: number, data: IUpdateService) => {
  return instanceWithToken.patch(`/api/v1/services/${id}`, data)
}

export const DELETE_COMPANY_SERVICE = async (id: number) => {
  return instanceWithToken.delete(`/api/v1/services/${id}`)
}

