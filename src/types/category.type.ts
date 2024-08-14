import { PaginationConfig } from './utils.type';

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  parentId: number;
  createdAt: string;
  updatedAt: string;
  children: CategoryItem[];
}

export interface CategoryListConfig extends PaginationConfig {
  sellerId?: number;
}

export interface CategoryRequestBody {
  name: string;
  description: string;
}
