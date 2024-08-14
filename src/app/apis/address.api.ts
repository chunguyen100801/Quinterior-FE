'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import {
  callApi3rdParty,
  serverFetchWithAutoRotation,
} from '@/utils/fetch/fetch-service';
import { MyAddressSchemaType } from '@/utils/rules/user.rule';
import { redirect } from 'next/navigation';
import {
  SuccessResponseApiAddress,
  AddressType,
  districtType,
  provinceType,
  wardType,
} from 'src/types/address.type';
import { ResponseApi } from 'src/types/utils.type';

const API_BASE_URL = 'https://api.mysupership.vn/v1/partner/areas';

export const addNewAddress = async (body: MyAddressSchemaType) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res = await serverFetchWithAutoRotation({
      method: 'POST',
      api: `/api/v1/addresses`,
      body,
    });
    return res ? res : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        error: error.message,
      };
    }
  }
};

//update the address by id
export const updateAddressById = async (
  id: string | number,
  body:
    | MyAddressSchemaType
    | {
        isDefault: boolean;
      }
) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res = await serverFetchWithAutoRotation({
      method: 'PATCH',
      api: `/api/v1/addresses/${id}`,
      body,
    });
    return res ? res : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        error: error.message,
      };
    }
  }
};

//get all province at vietnam by supership api
export const getAllProvince = async () => {
  try {
    const res: SuccessResponseApiAddress<provinceType[]> | null =
      await callApi3rdParty({
        method: 'GET',
        api: `${API_BASE_URL}/province`,
      });

    return res ? res.results : null;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};

//get all district by province id at vietnam by supership api
export const getAllDistrictByProvince = async (provinceId: string) => {
  try {
    const res: SuccessResponseApiAddress<districtType[]> | null =
      await callApi3rdParty({
        method: 'GET',
        api: `${API_BASE_URL}/district?province=${provinceId}`,
      });
    return res ? res.results : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        error: error.message,
      };
    }
  }
};

//get all ward by district id at vietnam by supership api
export const getAllWardByDistrict = async (districtId: string) => {
  try {
    const res: SuccessResponseApiAddress<wardType[]> | null =
      await callApi3rdParty({
        method: 'GET',
        api: `${API_BASE_URL}/commune?district=${districtId}`,
      });
    return res ? res.results : null;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    console.log(error);
  }
};

// get my address
export const getMyAddress = async () => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<AddressType[]> | null =
      await serverFetchWithAutoRotation({
        method: 'GET',
        api: `/api/v1/addresses`,
      });
    return res ? res.data : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

//delete the address by id
export const deleteAddressById = async (id: string | number) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res = await serverFetchWithAutoRotation({
      method: 'DELETE',
      api: `/api/v1/addresses/${id}`,
    });
    return res ? res.data : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        error: error.message,
      };
    }
  }
};
