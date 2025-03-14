import { instanceWithToken } from "./axios.service"

export const GET_CONTACT_REQUESTS = async () => {
  return instanceWithToken.get("/api/v1/contact-form")
}
export const DELETE_CONTACT_REQUESTS = async (id: number) => {
  return instanceWithToken.delete("/api/v1/contact-form/" + id)
}

