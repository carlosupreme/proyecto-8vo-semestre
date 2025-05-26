import { useAuth, useClerk } from "@clerk/clerk-react"
import axios, { type AxiosInstance } from "axios"
import { useEffect, useMemo } from "react"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const axiosInstance = axios.create({ baseURL });

export function useApi(): AxiosInstance {
    const { isSignedIn, userId } = useAuth()
    const { signOut } = useClerk()

    const api = useMemo(() => axiosInstance, []);

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use((config) => {
            if (isSignedIn) {
                config.headers.Authorization = `Bearer ${userId}`
            }
            return config
        })

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    signOut({ redirectUrl: '/' })
                }
                return Promise.reject(error)
            }
        )

        return () => {
            api.interceptors.request.eject(requestInterceptor)
            api.interceptors.response.eject(responseInterceptor)
        }
    }, [isSignedIn, userId, signOut, api])

    return api
}