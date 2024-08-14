'use client';
import { AspectType } from '@/app/(main-app)/blueprint/blueprint-interact-components/refiner/AspectOption';
import { clsx, type ClassValue } from 'clsx';
import { ACCEPTED_FILE_TYPES } from 'src/constants/file.rule';
import { twMerge } from 'tailwind-merge';

export function capitalizeFirstLetter(input: string): string {
  if (!input) return input; // Check for empty or undefined string
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export const queryStringValueToObject = (queryString: string) => {
  const obj: Record<string, string> = {};
  const pairs = queryString.split(',');
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    obj[key] = value;
  }
  return obj;
};

export const timestampToDateString = (timestamp: string) => {
  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  // Padding single-digit day and month with leading zeros if necessary
  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;

  const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
  return formattedDate;
};

export const formatPrice = (price: number, locale = 'vi', currency = 'VND') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });
  return formatter.format(price);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const validateImages = (_files: File[] | FileList, maxLength = 1) => {
  let isValid = true;
  let errorMessage = '';
  const files = _files ? Array.from(_files) : null;
  if (!files || files.length === 0) {
    isValid = false;
    errorMessage = 'Image is required.';
  } else if (maxLength === 1 && files.length > maxLength) {
    isValid = false;
    errorMessage = 'Only one image is allowed.';
  } else if (maxLength !== 1 && files.length > maxLength) {
    isValid = false;
    errorMessage = `Maximum of ${maxLength} images are allowed.`;
  } else {
    isValid = files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type));
    if (!isValid) {
      errorMessage = '.jpg, .jpeg, .png files are accepted.';
    }
  }
  return { isValid, errorMessage };
};

export const validateModel = (files: File[]) => {
  let isValid = true;
  let errorMessage = '';
  if (!files || files.length === 0) {
    isValid = false;
    errorMessage = 'Model is required.';
  } else if (files.length > 1) {
    isValid = false;
    errorMessage = 'Only one model is allowed.';
  } else {
    isValid = files.every((file) => file?.name?.endsWith('.glb'));
    if (!isValid) {
      errorMessage = '.glb file is accepted.';
    }
  }
  return { isValid, errorMessage };
};

export const formatPriceSV = (
  price: number,
  locale = 'vi',
  currency = 'VND'
) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });
  return formatter.format(price);
};

export function convertRatioToNumbers(ratioString: AspectType) {
  // Split the string by ':'
  const parts = ratioString.split(':');

  // Parse the parts as integers
  const width = parseInt(parts[0], 10);
  const height = parseInt(parts[1], 10);

  // Return the width and height as an array of numbers
  return width / height;
}

export function convertFileSize(
  size: number,
  inputUnit: string,
  outputUnit: string
) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const inputIndex = units.indexOf(inputUnit.toUpperCase());
  const outputIndex = units.indexOf(outputUnit.toUpperCase());

  if (inputIndex === -1 || outputIndex === -1) {
    throw new Error(
      'Invalid unit. Valid units are: B, KB, MB, GB, TB, PB, EB, ZB, YB'
    );
  }

  const sizeInBytes = size * Math.pow(1024, inputIndex);

  const convertedSize = sizeInBytes / Math.pow(1024, outputIndex);

  return `${convertedSize.toFixed(2)} ${outputUnit}`;
}

export const sleep = async (ms: number = 500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const mappingRange = (
  val: number,
  reverse: boolean,
  maxIn: number,
  minIn: number,
  maxOut: number,
  minOut: number
) => {
  return Math.ceil(
    Math.abs(1 * (reverse ? 1 : 0) - (val - minIn) / (maxIn - minIn)) *
      (maxOut - minOut) +
      minOut
  );
};

export const reverseMappingRange = (
  mappedVal: number,
  reverse: boolean,
  maxIn: number,
  minIn: number,
  maxOut: number,
  minOut: number
) => {
  const normalized = (mappedVal - minOut) / (maxOut - minOut);
  const originalNormalized = reverse ? 1 - normalized : normalized;
  return Math.floor(originalNormalized * (maxIn - minIn) + minIn);
};
