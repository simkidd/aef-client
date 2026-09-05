export interface Staff {
  _id: string;
  staffCode: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | string;
  email: string;
  phone: string;
  departmentId?: any;
  position: string;
  category: string;
  employmentStatus: string;
  assignedCentreId?: any;
  dateJoined: string;
  hasSystemAccount: boolean;
  userId?: any;
}

export interface Volunteer {
  _id: string;
  volunteerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  assignedCentreId?: any;
  startDate: string;
  status: string;
}
