export interface AppointmentPrimitives {
  id: string;
  businessId: string;
  date: string;
  clientId: string;
  timeRange: MinutesTimeRangePrimitives;
  notes: string;
  title: string
  tags: string[]
  color: string
}

export interface MinutesTimeRangePrimitives {
  startAt: number;
  endAt: number;
}

export interface Appointment extends AppointmentPrimitives { }

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
