export interface AttendanceRecord {
  _id: string;
  id?: string;
  beneficiaryId: any;
  enrollmentId: any;
  cohortId: any;
  skillAreaId: any;
  centreId: any;
  date: string;
  status: string;
  originalStatus?: string;
  correctionReason?: string;
  firstClockIn?: string;
  lastClockOut?: string;
  durationMinutes: number;
  isLate: boolean;
  minutesLate: number;
  isExcused: boolean;
  isManualCorrection: boolean;
  sessionId?: {
    _id: string;
    startTime?: string;
    endTime?: string;
    slotNumber?: number;
    topic?: string;
    sessionType?: string;
  } | any;
  notes?: string;
}
