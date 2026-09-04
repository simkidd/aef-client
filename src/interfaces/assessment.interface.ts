export interface Assessment {
  _id: string;
  title: string;
  programId: any;
  cohortId: any;
  skillAreaId: any;
  type: string;
  maxScore: number;
  passingScore: number;
  scheduledDate: string;
}
