export interface SkillArea {
  _id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  defaultDurationWeeks: number;
  certificationType: string;
  isActive: boolean;
}

export interface Program {
  _id: string;
  title: string;
  code: string;
  description: string;
  organizerType: string;
  organizerName: string;
  deliveryRole: string;
  status: string;
  skillAreaIds: any[];
  eligibilityCriteria?: string[];
  maxSlots?: number;
  applicationStartDate?: string;
  applicationDeadline?: string;
  published: boolean;
  isFeatured: boolean;
  stats?: {
    cohorts: number;
    applications: number;
  };
}

export interface CohortSkillConfig {
  skillAreaId: any;
  skillName?: string;
  trainerStaffIds?: any[];
  assignedRoomId?: any;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  durationWeeks: number;
  maxCapacity: number;
}

export interface CohortCapacityMetrics {
  maxCapacity: number;
  active: number;
  selectedPending: number;
  dropped: number;
  withdrawn: number;
  completed: number;
  availableSlots: number;
}

export interface Cohort {
  _id: string;
  name: string;
  cohortCode: string;
  programId: any;
  centreId: any;
  startDate: string;
  endDate: string;
  status: string;
  maxCapacity: number;
  skillConfigs: CohortSkillConfig[];
  capacityMetrics?: CohortCapacityMetrics;
}

export interface TrainingSession {
  _id: string;
  cohortId: any;
  programId: any;
  centreId: any;
  skillAreaId: any;
  trainerStaffId?: any;
  roomId?: any;
  sessionDate: string;
  startTime: string;
  endTime: string;
  topic?: string;
  sessionType: string;
  isCancelled: boolean;
  cancellationReason?: string;
}
