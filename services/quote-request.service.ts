import { instanceWithToken } from "./axios.service"

type QuoteType = "EDU" | "TRAVEL"
enum QuoteRequestType {
  INTERNSHIPS = "INTERNSHIPS",
  TEACHER_TRAININGS = "TEACHER_TRAININGS",
  SHORT_TERM_PROGRAMS = "SHORT_TERM_PROGRAMS",
  DEGREE_PROGRAMS = "DEGREE_PROGRAMS",
  TOUR_PACKAGE = "TOUR_PACKAGE",
  FULL_VIP_ASSISTANCE = "FULL_VIP_ASSISTANCE",
  MEET_AND_GREET_FAST_TRACK = "MEET_AND_GREET_FAST_TRACK",
  GROUND_TRANSPORTATION = "GROUND_TRANSPORTATION",
}
export interface IQuoteRequest {
  id: number
  name: string
  email: string
  phoneNumber?: string
  message: string
  type: QuoteType
  requestType: QuoteRequestType
  createdAt: string
  updatedAt: string
}

export const GET_QUOTE_REQUESTS = async () => {
  return instanceWithToken.get("/api/v1/quote-request")
}

export const GET_QUOTE_REQUEST = async (id: number) => {
  return instanceWithToken.get(`/api/v1/quote-request/${id}`)
}

export const DELETE_QUOTE_REQUEST = async (id: number) => {
  return instanceWithToken.delete(`/api/v1/quote-request/${id}`)
}

