export interface FarmerResponse {
  name?: string;
  DOB?: string;
  gender?: string;
  mobile_num?: string;
  village?: string;
  pincode?: string;
  photo?: string;
}

export interface FarmResponse {
  name?: string;
  address?: string;
  Tarea?: number;
  Uarea?: number;
  unit?: string;
  type?: string;
  watersrc?: string;
  soil?: string;
  blockCount?: number;
  photo?: string;
}

export interface BlockResponse {
  blockNumber?: number;             // might be error
  name?: string;
  area?: number;
  farmingType?: string;
  watersrc?: string;
}

export interface InterviewResponses {
  farmer: FarmerResponse;
  farm: FarmResponse;
  blocks: BlockResponse[];
}