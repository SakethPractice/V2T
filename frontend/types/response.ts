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
  type?: string;
  watersrc?: string;
  blockCount?: number;
  photo?: string;
}

export interface BlockResponse {
  blockNumber?: number;             // might be error
  name?: string;
  area?: number;
  farmingType?: string;
  watersrc?: string;
  soil?: string;
}

export interface InterviewResponses {
  farmer: FarmerResponse;
  farm: FarmResponse;
  blocks: BlockResponse[];
}

export const createEmptyFarmerResponse = (): FarmerResponse => ({
  name: "",
  age: undefined,
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
  Tarea: undefined,
  Uarea: undefined,
  type: "",
  watersrc: "",
  blockCount: undefined,
  photo: "",
});

export const createEmptyBlockResponse = (): BlockResponse => ({
  blockNumber: undefined,
  name: "",
  area: undefined,
  farmingType: "",
  watersrc: "",
  soil: "",
});

export const createEmptyInterviewResponses = (): InterviewResponses => ({
  farmer: createEmptyFarmerResponse(),
  farm: createEmptyFarmResponse(),
  blocks: [],
});
