export interface AttendanceRecord {
  _id: string;
  beneficiaryId: any;
  enrollmentId: any;
  cohortId: any;
  skillAreaId: any;
  centreId: any;
  date: string;
  status: string;
  firstClockIn?: string;
  lastClockOut?: string;
  durationMinutes: number;
  isLate: boolean;
  minutesLate: number;
  isExcused: boolean;
  isManualCorrection: boolean;
  notes?: string;
}
