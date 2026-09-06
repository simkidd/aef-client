export interface AssessmentCriteria {
  name: string;
  maxPoints: number;
  description?: string;
}

export interface Assessment {
  _id: string;
  title: string;
  description?: string;
  programId: any;
  cohortId: any;
  skillAreaId: any;
  type: string;
  maxScore: number;
  passingScore: number;
  scheduledDate: string;
  criteria?: AssessmentCriteria[];
}
