
export type User = {
    id: string;
    name: string;
    phoneNumber: string;
    instanceId: string;
    assistantConfig: {
        id: string;
        enabled: boolean;
    };
    plan: {
        leftMessages: number;
        status: string;
        active: boolean;
        endTimestamp: number;
        name: string;
        startTimestamp: number;
        totalMessages: number;
        type: string;
        usedMessages: number;
    };
    photo: string;
}


export interface UpdateUserRequest {
  name?: string;
  logo?: string;
}
export type WeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface WorkDay {
  startAt: number; // minutos desde medianoche (ej. 540 = 9:00 AM)
  endAt: number;   // minutos desde medianoche (ej. 1080 = 6:00 PM)
}

interface NonWorkDate {
  date: string;        // Formato ISO (ej. "2024-12-25")
  reason: string;      // Motivo por el que no se trabaja
  recurrent: boolean;  // Si se repite cada año
}

export interface BusinessSchedule {
  id: string;
  businessId: string;
  weeklyWorkDays: Partial<Record<WeekDay, WorkDay>>; // Si no aparece un día, no se trabaja ese día
  nonWorkDates: NonWorkDate[];
}

export interface UpdateBusinessScheduleRequest {
  weeklyWorkDays?: Partial<Record<WeekDay, WorkDay>>;
  nonWorkDates?: NonWorkDate[];
}
