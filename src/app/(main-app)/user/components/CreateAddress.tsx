/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { Key, useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Textarea } from '@nextui-org/react';
import {
  getAllProvince,
  getAllDistrictByProvince,
  getAllWardByDistrict,
} from '@/app/apis/address.api';
import {
  AddressType,
  districtType,
  provinceType,
  wardType,
} from 'src/types/address.type';

interface Props {
  setAddress?: React.Dispatch<React.SetStateAction<string>>;
  setCheckEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  myAddressData?: string;
  onChange?: (value: string) => void;
}

const SEPARATOR = '=';

export default function CreateAddress({
  setAddress,
  setCheckEmpty,
  isLoading,
  myAddressData,
  onChange,
}: Props) {
  const [provinceData, setProvinceData] = useState<provinceType[]>([]);
  const [districtData, setDistrictData] = useState<districtType[]>([]);
  const [wardData, setWardData] = useState<wardType[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');

  const [streetName, wardName, districtName, provinceName] = myAddressData
    ? myAddressData.split(', ')
    : ['', '', '', ''];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provinces = await getAllProvince();
        provinces && setProvinceData(provinces as provinceType[]);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (provinceName) {
        const provinceCode = provinceData.find(
          (item) => item.name === provinceName
        )?.code;
        const districts = await handleProvinceChange(
          `${provinceName}${SEPARATOR}${provinceCode}`
        );

        const districtCode =
          Array.isArray(districts) &&
          districts.find((item) => item.name === districtName)?.code;
        const wards = await handleDistrictChange(
          `${districtName}${SEPARATOR}${districtCode}`
        );

        const wardCode =
          Array.isArray(wards) &&
          wards.find((item) => item.name === wardName)?.code;
        await handleWardChange(`${wardName}${SEPARATOR}${wardCode}`);
        setStreetAddress(streetName);
      }
    };
    fetchData();
  }, [districtName, provinceData, provinceName, streetName, wardName]);

  const handleProvinceChange = async (provinceValue: string) => {
    if (!provinceValue) {
      setDistrictData([]);
      setWardData([]);
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
      return;
    }
    try {
      const [name, code] = provinceValue.split(SEPARATOR);

      const districts = await getAllDistrictByProvince(code);
      setDistrictData(districts as districtType[]);
      setWardData([]);
      setSelectedProvince(provinceValue);
      setSelectedDistrict('');
      setSelectedWard('');
      return districts;
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleDistrictChange = async (districtValue: string) => {
    if (!districtValue) {
      setWardData([]);
      setSelectedDistrict('');
      setSelectedWard('');
      return;
    }
    try {
      const [name, code] = districtValue.split(SEPARATOR);
      const wards = await getAllWardByDistrict(code);
      setWardData(wards as wardType[]);
      setSelectedDistrict(districtValue);
      setSelectedWard('');
      return wards;
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleWardChange = async (wardValue: string) => {
    if (!wardValue) {
      setSelectedWard('');
      return;
    }
    try {
      const [name, code] = wardValue.split(SEPARATOR);
      setSelectedWard(wardValue);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleStreetNameChange = (value: string) => {
    setStreetAddress(value);
  };

  useEffect(() => {
    const address = `${streetAddress}, ${selectedWard.split(SEPARATOR)[0]}, ${
      selectedDistrict.split(SEPARATOR)[0]
    }, ${selectedProvince.split(SEPARATOR)[0]}`;

    setAddress && setAddress(address);
    onChange && onChange(address);

    setCheckEmpty(
      !streetAddress || !selectedWard || !selectedDistrict || !selectedProvince
    );
  }, [
    onChange,
    selectedDistrict,
    selectedProvince,
    selectedWard,
    setAddress,
    setCheckEmpty,
    streetAddress,
  ]);

  return (
    <>
      <div className="mb-4 gap-x-[2rem] md:flex md:justify-between md:gap-[1rem]">
        <Autocomplete
          inputProps={{
            classNames: {
              // inputWrapper: 'border-gray-300',
            },
          }}
          label="Province"
          defaultItems={provinceData}
          className="mb-4 md:mb-0"
          allowsCustomValue={true}
          variant="bordered"
          onSelectionChange={
            handleProvinceChange as (key: Key | null) => Promise<
              | districtType[]
              | {
                  error: string;
                }
              | null
              | undefined
            >
          }
          isDisabled={provinceData?.length === 0 || isLoading}
          // isRequired
          selectedKey={selectedProvince || null}
          onKeyDown={(e) => {
            if ('continuePropagation' in e) {
              e.continuePropagation();
            }
          }}
        >
          {(item) => (
            <AutocompleteItem key={`${item.name}${SEPARATOR}${item.code}`}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          inputProps={{
            classNames: {
              // inputWrapper: 'border-gray-300',
            },
          }}
          label="District"
          defaultItems={districtData}
          className="mb-4 md:mb-0"
          allowsCustomValue={true}
          variant="bordered"
          onSelectionChange={
            handleDistrictChange as (key: Key | null) => Promise<
              | wardType[]
              | {
                  error: string;
                }
              | null
              | undefined
            >
          }
          isDisabled={!selectedProvince || isLoading}
          // isRequired
          selectedKey={selectedDistrict || null}
          onKeyDown={(e) => {
            if ('continuePropagation' in e) {
              e.continuePropagation();
            }
          }}
        >
          {(item) => (
            <AutocompleteItem key={`${item.name}${SEPARATOR}${item.code}`}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          inputProps={{
            classNames: {
              // inputWrapper: 'border-gray-300',
            },
          }}
          label="Ward"
          defaultItems={wardData}
          allowsCustomValue={true}
          variant="bordered"
          isDisabled={!selectedDistrict || isLoading}
          onSelectionChange={handleWardChange as (key: Key | null) => void} // Fix: Change the type of onSelectionChange prop
          // isRequired
          selectedKey={selectedWard || null}
          onKeyDown={(e) => {
            if ('continuePropagation' in e) {
              e.continuePropagation();
            }
          }}
        >
          {(item) => (
            <AutocompleteItem key={`${item.name}${SEPARATOR}${item.code}`}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <div className="">
        <Textarea
          variant="bordered"
          // placeholder="Street Name, Building, House No."
          size="sm"
          label="Street Name, Building, House No"
          value={streetAddress}
          isDisabled={!selectedWard || isLoading}
          onValueChange={handleStreetNameChange}
          // isRequired
          classNames={
            {
              // inputWrapper: ['border-gray-300'],
            }
          }
        />
      </div>
    </>
  );
}
