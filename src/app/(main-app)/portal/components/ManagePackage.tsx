/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  managePackageFormSchema,
  ManagePackageFormSchemaType,
} from '@/utils/rules/package.rule';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryItem } from 'src/types/category.type';
import { toast } from 'sonner';
import { createAsset, updateAsset } from '@/app/apis/asset.api';
import { AssetItemType } from 'src/types/asset.type';
import { useRouter } from 'next/navigation';
import { HttpStatusCode } from 'src/constants/enum';
import {
  MetaType,
  UnprocessableEntityErrorResponseType,
} from 'src/types/utils.type';
import ManagePackageFormContent from './ManagePackageFormContent';
import { validateImages, validateModel } from '@/utils/utils-client';
import { UserInFo } from '@/lucia-auth/auth-actions';

export enum TabIndex {
  PackageUpload = 0,
  Details = 1,
  Media = 2,
}

interface ManagePackageContextType {
  categoriesState?: CategoriesState;
  setCategoriesState: React.Dispatch<React.SetStateAction<CategoriesState>>;
  defaultValues?: AssetItemType;
}

export const ManagePackageContext =
  React.createContext<ManagePackageContextType>({
    categoriesState: undefined,
    defaultValues: undefined,
    setCategoriesState: () => {},
  });

interface Props {
  categories: CategoryItem[];
  userInfo?: UserInFo;
  defaultValues?: AssetItemType;
  type: 'view' | 'edit' | 'create';
  categoriesMeta?: MetaType;
}

interface CategoriesState {
  data: CategoryItem[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  userId?: number;
}

function ManagePackage({
  categories,
  defaultValues,
  type,
  userInfo,
  categoriesMeta,
}: Props) {
  const router = useRouter();
  const categoryIds = useMemo(
    () =>
      defaultValues?.categories.map((category) => String(category.id)) || [],
    [defaultValues?.categories]
  );
  const _defaultValues: ManagePackageFormSchemaType = {
    background: defaultValues?.background ?? '#aa6363',
    categoryIds: categoryIds,
    description: defaultValues?.description ?? '',
    name: defaultValues?.name ?? '',
    price: String(defaultValues?.price ?? '10000'),
    quantity: String(defaultValues?.quantity ?? '100'),
    images: [],
    model: null,
    thumbnail: null,
    modelData: {
      width: String(defaultValues?.model?.x ?? ''),
      height: String(defaultValues?.model?.y ?? ''),
      depth: String(defaultValues?.model?.z ?? ''),
      modelType: defaultValues?.model?.type ?? '',
    },
  };

  const methods = useForm<ManagePackageFormSchemaType>({
    defaultValues: _defaultValues,
    resolver: zodResolver(managePackageFormSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesState, setCategoriesState] = useState<CategoriesState>({
    data: categories,
    page: categoriesMeta?.page || 1,
    hasMore: categoriesMeta
      ? categoriesMeta.page < categoriesMeta.pageCount
      : false,
    isLoading: false,
    userId: userInfo?.id,
  });

  const { handleSubmit, setError, reset, watch } = methods;

  const onValid = async (data: ManagePackageFormSchemaType) => {
    if (type === 'view') return;
    if (isLoading) return;

    const categoryIds = data.categoryIds.join(',');
    const modelData = {
      x: +data.modelData.width,
      y: +data.modelData.height,
      z: +data.modelData.depth,
      type: data.modelData.modelType,
    };

    try {
      const formData = new FormData();
      data.background && formData.append('background', data.background);
      categoryIds && formData.append('categoryIds', categoryIds);
      data.description && formData.append('description', data.description);
      data.name && formData.append('name', data.name);
      data.price && formData.append('price', data.price);
      data.quantity && formData.append('quantity', data.quantity);
      data.model?.[0] && formData.append('model', data.model[0]);
      data.thumbnail?.[0] && formData.append('thumbnail', data.thumbnail[0]);
      modelData && formData.append('modelData', JSON.stringify(modelData));
      (data.images as File[]).forEach((image) => {
        formData.append('images', image);
      });

      setIsLoading(true);

      let res = null;

      if (type === 'create') res = await createAsset(formData);
      else if (type === 'edit' && defaultValues?.id)
        res = await updateAsset(defaultValues.id, formData);

      if (
        res &&
        res.statusCode === HttpStatusCode.UnprocessableEntity &&
        res.data
      ) {
        const errors = res.data as UnprocessableEntityErrorResponseType[];

        errors.forEach((error) => {
          setError(error.field as keyof ManagePackageFormSchemaType, {
            type: 'server',
            message: error.message,
          });
        });
      } else if (
        res &&
        [HttpStatusCode.Created, HttpStatusCode.OK].includes(res.statusCode)
      ) {
        reset();
        toast.success(res?.message);
        router.push('/portal');
      } else {
        console.log('====> res', res);
        toast.error(res?.message);
      }
    } catch (error) {
      console.log('====> error', error);
      toast.error((error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = async () => {
    const images = watch('images');
    const thumbnail = watch('thumbnail');
    const model = watch('model');

    const imagesValidation = validateImages(images, 5);
    const thumbnailValidation = validateImages(thumbnail, 1);
    const modelValidation = validateModel(model);

    if (
      ((type === 'edit' && images && images.length > 0) || type === 'create') &&
      !imagesValidation.isValid
    ) {
      setError('images', {
        message: imagesValidation.errorMessage,
      });
    }
    if (
      ((type === 'edit' && thumbnail) || type === 'create') &&
      !thumbnailValidation.isValid
    ) {
      setError('thumbnail', {
        message: thumbnailValidation.errorMessage,
      });
    }
    if (
      ((type === 'edit' && model) || type === 'create') &&
      !modelValidation.isValid
    ) {
      setError('model', {
        message: modelValidation.errorMessage,
      });
    }
  };

  const onSubmit = handleSubmit(onValid, onInvalid);

  return (
    <ManagePackageContext.Provider
      value={{
        categoriesState,
        setCategoriesState,
        defaultValues,
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <ManagePackageFormContent isLoading={isLoading} type={type} />
        </form>
      </FormProvider>
    </ManagePackageContext.Provider>
  );
}

export default ManagePackage;
