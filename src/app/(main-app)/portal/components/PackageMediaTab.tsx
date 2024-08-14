'use client';
import { ManagePackageFormSchemaType } from '@/utils/rules/package.rule';
import React, { ReactNode, useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import InputFile from 'src/components/InputFile';
import { ManagePackageContext } from './ManagePackage';

function PackageMediaTab() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ManagePackageFormSchemaType>();

  const { defaultValues } = useContext(ManagePackageContext);

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h3 className="mb-[8px] text-base font-medium text-white">Thumbnail</h3>
        <p className="mb-[16px] text-sm text-default-500">
          Upload thumnail to promote your package in the Asset Store.
        </p>
        <Controller
          control={control}
          name="thumbnail"
          render={({ field: { onChange, value, ...rest } }) => {
            return (
              <InputFile
                {...rest}
                files={value}
                urls={defaultValues?.thumbnail ? [defaultValues.thumbnail] : []}
                onChangeFiles={onChange}
                isShowPreview
              />
            );
          }}
        />
        <p className="min-h-[20px] text-sm text-red-400">
          {errors.thumbnail?.message as ReactNode}
        </p>
      </div>

      <div>
        <h3 className="mb-[8px] text-base font-medium text-white">Images</h3>
        <p className="mb-[16px] text-sm text-default-500">
          Upload images to promote your package in the Asset Store. Maximum 5
          images.
        </p>
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value, ...rest } }) => {
            return (
              <InputFile
                {...rest}
                files={value}
                urls={defaultValues?.images}
                onChangeFiles={onChange}
                isShowPreview
              />
            );
          }}
        />
        <p className="min-h-[20px] text-sm text-red-400">
          {errors.images?.message as ReactNode}
        </p>
      </div>
    </div>
  );
}

export default PackageMediaTab;
