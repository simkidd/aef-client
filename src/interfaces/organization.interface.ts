export interface Organization {
  _id: string;
  name: string;
  code: string;
  tagline?: string;
  description?: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  country: string;
  website?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartmentId?: any;
  isActive: boolean;
}

export interface Partner {
  _id: string;
  name: string;
  code: string;
  type: string;
  contactPerson: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  email: string;
  phone?: string;
  status: string;
}
