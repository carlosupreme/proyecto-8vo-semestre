import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  type AppointmentQueryParams
} from '../appointment-service';
import type { AppointmentPrimitives } from '../types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

// Query keys for React Query
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: AppointmentQueryParams) => 
    [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

/**
 * Hook for fetching appointments by date range
 */
export function useAppointments(startDate: Date, endDate: Date, businessId?: string) {
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: appointmentKeys.list({ 
      startDate: formattedStartDate, 
      endDate: formattedEndDate,
      businessId 
    }),
    queryFn: () => fetchAppointments({ 
      startDate: formattedStartDate, 
      endDate: formattedEndDate,
      businessId 
    }),
  });
}

/**
 * Hook for fetching appointments for a specific day
 */
export function useDayAppointments(date: Date, businessId?: string) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  return useAppointments(dayStart, dayEnd, businessId);
}

/**
 * Hook for fetching appointments for a specific week
 */
export function useWeekAppointments(date: Date, businessId?: string) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  
  return useAppointments(weekStart, weekEnd, businessId);
}

/**
 * Hook for fetching appointments for a specific month
 */
export function useMonthAppointments(date: Date, businessId?: string) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  return useAppointments(monthStart, monthEnd, businessId);
}

/**
 * Hook for creating a new appointment
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newAppointment: Omit<AppointmentPrimitives, 'id'>) => 
      createAppointment(newAppointment),
    onSuccess: () => {
      // Invalidate all appointment lists to refetch data
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

/**
 * Hook for updating an appointment
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, appointment }: { id: string; appointment: Partial<AppointmentPrimitives> }) => 
      updateAppointment(id, appointment),
    onSuccess: (data) => {
      // Invalidate specific appointment and all lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

/**
 * Hook for deleting an appointment
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: (_, id) => {
      // Invalidate specific appointment and all lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}
