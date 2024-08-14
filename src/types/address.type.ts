export interface provinceType {
  name: string;
  code: string;
}

export interface districtType extends provinceType {
  province: string;
}

export interface wardType extends provinceType {
  district: string;
}

export type SuccessResponseApiAddress<T> = {
  status: string;
  results: T;
};

export interface AddressType {
  id: number;
  userId: number;
  address: string;
  email: string;
  phone: string;
  fullName: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
