export interface AppointmentPrimitives {
  id: string;
  businessId: string;
  date: string;
  clientId: string;
  timeRange: MinutesTimeRangePrimitives;
  notes: string;
}

export interface MinutesTimeRangePrimitives {
  startAt: number;
  endAt: number;
}

// Extended appointment type with UI-specific properties
export interface Appointment extends AppointmentPrimitives {
  title?: string;
  color?: string;
  tags?: string[];
  genre?: string;
}

// Helper functions for time conversion
export function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
