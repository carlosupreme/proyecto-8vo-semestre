import type { AppointmentPrimitives } from './types';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface AppointmentQueryParams {
  startDate: string;
  endDate: string;
}

/**
 * Fetches appointments from the backend based on date range
 */
export async function fetchAppointments(params: AppointmentQueryParams): Promise<AppointmentPrimitives[]> {
  const queryParams = new URLSearchParams();
  
  // Add required parameters
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);
  
  try {
    const response = await fetch(`${API_BASE_URL}/appointments?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userId")}`,
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

/**
 * Creates a new appointment
 */
export async function createAppointment(appointment: Omit<AppointmentPrimitives, 'id' | 'businessId'>): Promise<AppointmentPrimitives> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("userId")}`,
      },
      body: JSON.stringify(appointment),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

/**
 * Updates an existing appointment
 */
export async function updateAppointment(id: string, appointment: Partial<AppointmentPrimitives>): Promise<AppointmentPrimitives> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("userId")}`,
      },
      body: JSON.stringify(appointment),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

/**
 * Deletes an appointment
 */
export async function deleteAppointment(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userId")}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}
