import { ELimit } from 'src/constants/enum';

export type ResponseApi<T> = {
  message: string;
  data: T;
  statusCode: number;
};

export type UnprocessableEntityErrorResponseType = {
  field: string;
  message: string;
};
export interface MetaType {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ResponseWithPaging<T> {
  data: T;
  meta: MetaType;
}

export interface PaginationConfig {
  page?: string;
  take?: ELimit;
  search?: string;
}
