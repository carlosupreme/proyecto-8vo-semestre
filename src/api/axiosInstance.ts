import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
})

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('userId')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userId')
        }
        return Promise.reject(error)
    }
)