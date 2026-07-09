export interface FarmerResponse {
  name?: string;
  age?: string;
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
  lat?: number;
  long?: number;
  Tarea?: string;
  Uarea?: string;
  type?: string;
  watersrc?: string;
  blockCount?: string;
  photo?: string;
}

export interface BlockResponse {
  blockNumber?: number;             // might be error
  name?: string;
  area?: string;
  farmingType?: string;
  soil?: string;
}

export interface InterviewResponses {
  farmer: FarmerResponse;
  farm: FarmResponse;
  blocks: BlockResponse[];
}

export const createEmptyFarmerResponse = (): FarmerResponse => ({
  name: "",
  age: "",
  gender: "",
  mobile_num: "",
  address: "",
  village: "",
  taluk: "",
  district: "",
  state: "",
  pincode: "",
  photo: "",
});

export const createEmptyFarmResponse = (): FarmResponse => ({
  name: "",
  address: "",
  village: "",
  taluk: "",
  state: "",
  pincode: "",
  district: "",
  Tarea: "",
  Uarea: "",
  type: "",
  watersrc: "",
  blockCount: "",
  photo: "",
});

export const createEmptyBlockResponse = (): BlockResponse => ({
  blockNumber: undefined,
  name: "",
  area: "",
  farmingType: "",
  soil: "",
});

export const createEmptyInterviewResponses = (): InterviewResponses => ({
  farmer: createEmptyFarmerResponse(),
  farm: createEmptyFarmResponse(),
  blocks: [],
});
