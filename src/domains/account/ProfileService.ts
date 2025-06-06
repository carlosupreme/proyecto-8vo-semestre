import { api } from "../../api/axiosInstance"
import type { BusinessSchedule, UpdateBusinessScheduleRequest, UpdateUserRequest, User } from "./types"


export const ProfileService = {
    getMe: async () => {
        const response = await api.get<User>('/auth/user')
        return response.data
    },

    updateProfile: async (data: UpdateUserRequest) => {
        const response = await api.put<User>('/auth/user', data)
        return response.data
    }
}


export const ScheduleService = {
    getSchedule: async () => {
        const response = await api.get<BusinessSchedule>('/schedule')
        return response.data
    },

    updateSchedule: async (data: UpdateBusinessScheduleRequest) => {
        const response = await api.put<BusinessSchedule>('/schedule', data)
        return response.data
    }
}