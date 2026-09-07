export interface Staff {
  _id: string;
  staffCode: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | string;
  email: string;
  phone: string;
  position: string;
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
  gender?: string;
  skills: string[];
  assignedCentreId?: any;
  responsibilities?: string;
  startDate: string;
  status: string;
  hoursLogged?: number;
}
