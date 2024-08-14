export enum EOrderType {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ESortBy {
  POPULARITY = 'popularity',
  RATING = 'rating',
  NAME = 'name',
  PRICE = 'price',
}

export enum ELimit {
  EIGHT = '8',
  FIVE = '5',
  TEN = '10',
  FIFTEEN = '15',
  TWENTY = '20',
  FIFTY = '50',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMAL',
  NONE = 'NONE',
}

export enum HttpStatusCode {
  // 1xx Informational
  Continue = 100,
  SwitchingProtocols = 101,

  // 2xx Success
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,

  // 3xx Redirection
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  NotModified = 304,

  // 4xx Client Error
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  UnprocessableEntity = 422,

  // 5xx Server Error
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
}

export enum ModelType {
  FLOOR_ITEM = 'FLOOR_ITEM',
  IN_WALL_ITEM = 'IN_WALL_ITEM',
  WALL_ITEM = 'WALL_ITEM',
  DECORATE_ITEM = 'DECORATE_ITEM',
  ROOF_ITEM = 'ROOF_ITEM',
}

export enum PurchaseStatus {
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  DELIVERING = 'DELIVERING',
  RECEIVED = 'RECEIVED',
  CANCELED = 'CANCELED',
}

export enum CommentType {
  REPLY = 'Reply',
  REVIEW = 'Review',
}

export enum EAssetListMode {
  NORMAL = '0',
  SEARCH = '1',
}

export enum PaymentType {
  TRANSFER = 'TRANSFER',
}
