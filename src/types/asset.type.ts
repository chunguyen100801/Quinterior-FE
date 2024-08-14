import { EAssetListMode, EOrderType, ModelType } from 'src/constants/enum';
import { CategoryItem } from './category.type';
import { PublisherInfoType } from './publisher.type';
import { MetaType, PaginationConfig } from './utils.type';

export interface AssetListConfig extends PaginationConfig {
  name?: string;
  order?: EOrderType;
  price?: string;
  rating?: string;
  categoryIds?: string;
  sellerId?: string;
  image?: string;
  mode?: EAssetListMode;
}

export type ModelData = {
  id: number;
  productId: number;
  x: number;
  y: number;
  z: number;
  url: string;
  type: ModelType;
  file: {
    type: string;
    size: number;
    createdAt: string;
    updatedAt: string;
  };
};

export interface AssetItemType {
  id: number;
  sellerId: number;
  name: string;
  quantity: number;
  description: string;
  background: string;
  price: number;
  images: string[];
  thumbnail: string;
  avgRating: number;
  totalRating: number;
  sold: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  seller: PublisherInfoType;
  categories: CategoryItem[];
  model: ModelData;
}

export interface AssetListResponse {
  data: AssetItemType[];
  meta: MetaType;
}

export type { MetaType };
