import axios from "axios"

export class ApiInstance {
  instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  })

  constructor() {
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token")

      if (token) {
        config.headers.authorization = `Bearer ${token}`
      }

      return config
    })

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          // localStorage.removeItem("access-token");
          // localStorage.removeItem("refresh-token");
          // window.location.href = "/login";
        }
        throw err
      },
    )
  }
}

export const instanceWithToken = new ApiInstance().instance

