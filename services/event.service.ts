import { instanceWithToken } from "./axios.service"

export interface Benefit {
  title: string
  description: string
}

export interface EventData {
  id?: number
  eventName: string
  eventDate: string
  eventTime: string
  location: string
  description: string
  studentBenefits: Benefit[]
  institutionBenefits: Benefit[]
  registrationDeadline: string
  visible: boolean
}

export const GET_EVENT = async () => {
  return instanceWithToken.get(`/api/v1/event-info`)
}

export const UPDATE_EVENT_FIELD = async (field: string, value: any) => {
  const updateData = { [field]: value }
  return instanceWithToken.patch(`/api/v1/event-info`, updateData)
}

export const TOGGLE_EVENT_VISIBILITY = async () => {
  return instanceWithToken.post("/api/v1/event-info/visibility")
}

