export interface TrainingCentre {
  _id: string;
  name: string;
  centreCode: string;
  address: string;
  state: string;
  lga: string;
  contactEmail: string;
  contactPhone: string;
  capacity: number;
  status: string;
  centreManagerId?:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        position?: string;
      };
  stats?: {
    rooms: number;
    devices: number;
    activeCohorts: number;
  };
}

export interface RoomFacility {
  _id: string;
  centreId: any;
  name: string;
  roomNumber?: string;
  type: string;
  capacity: number;
  equipment: string[];
  isAvailable: boolean;
  status: string;
}

export interface Asset {
  _id: string;
  assetTag: string;
  name: string;
  category: string;
  centreId?: any;
  condition: string;
  status: string;
}

export interface CentreDetailData {
  centre: TrainingCentre;
  rooms: RoomFacility[];
  devices: any[];
  cohorts: any[];
}

