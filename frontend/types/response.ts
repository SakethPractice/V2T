export interface FarmerResponse {
  name?: string;
  age?: number;
  gender?: string;
  mobile_num?: string;
  address: string;
  village: string;
  taluk : string;
  district: string;
  state: string;
  pincode: string;
  photo?: string;
}

export interface FarmResponse {
  name?: string;
  address?: string;
  village?: string;
  taluk?: string;
  state?: string;
  pincode?: string;
  district?: string;
  Tarea?: number;
  Uarea?: number;
  farmingType?: string;
  watersrc?: string;
  blockCount?: number;
  photo?: string;
}

export interface BlockResponse {
  blockNumber?: number;             // might be error
  name?: string;
  area?: number;
  farmingType?: string;
  soil?: string;
}

export interface InterviewResponses {
  farmer: FarmerResponse;
  farm: FarmResponse;
  blocks: BlockResponse[];
}