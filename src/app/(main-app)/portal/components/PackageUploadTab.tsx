'use client';
import { ManagePackageFormSchemaType } from '@/utils/rules/package.rule';
import { Select, SelectItem } from '@nextui-org/react';
import React, { useState, ReactNode, useEffect, useContext } from 'react';
import { SketchPicker } from 'react-color';
import {
  Controller,
  useFormContext,
  useWatch,
  useFormState,
} from 'react-hook-form';
import InputFile from 'src/components/InputFile';
import { ModelType } from 'src/constants/enum';
import CategoriesListDropdown from './CategoriesListDropdown';
import Show3DModal from '../../marketplace/assets/components/Show3DModal';
import { validateModel } from '@/utils/utils-client';
import { ManagePackageContext } from './ManagePackage';

function PackageUploadTab() {
  const { control } = useFormContext<ManagePackageFormSchemaType>();
  const { defaultValues } = useContext(ManagePackageContext);

  const { background, model, name } = useWatch({
    control,
  });

  const { errors } = useFormState({ control });
  const typeList = Object.keys(ModelType).map((key) => {
    const name = key
      .split('_')
      .filter((x) => x !== 'ITEM')
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join(' ');
    return {
      id: key,
      name: name,
    };
  });

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [previewModel, setPreviewModel] = useState(
    defaultValues?.model.url || ''
  );

  const handlePreviewModal = () => {
    if (errors.model) {
      setPreviewModel('');
      return;
    }
    if (Array.isArray(model)) {
      const modalValidation = validateModel(model);
      const file = model[0];
      if (file && modalValidation.isValid) {
        setPreviewModel(URL.createObjectURL(file));
      } else {
        setPreviewModel('');
      }
    }
  };

  useEffect(() => {
    handlePreviewModal();

    return () => {
      if (model) {
        URL.revokeObjectURL(previewModel);
        setPreviewModel('');
      }
    };
  }, [model, errors.model]);

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h3 className="mb-[8px] text-base font-medium text-white">Category</h3>

        <CategoriesListDropdown />
        <p className="min-h-[20px] text-sm text-red-400">
          {errors.categoryIds?.message}
        </p>
      </div>

      <div>
        <h3 className="mb-[8px] text-base font-medium text-white">Type</h3>
        <Controller
          control={control}
          name="modelData.modelType"
          render={({ field: { onChange, value, ...rest } }) => {
            return (
              <Select
                {...rest}
                items={typeList}
                selectedKeys={[value]}
                onChange={onChange}
                label="Select a type"
                classNames={{
                  value: 'font-medium',
                  popoverContent: 'rounded-[4px]',
                }}
                radius="sm"
              >
                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
              </Select>
            );
          }}
        />
        <p className="min-h-[20px] text-sm text-red-400">
          {errors.modelData?.modelType?.message}
        </p>
      </div>

      <div>
        <div className="mb-[8px] flex items-center gap-3">
          <h3 className="text-base font-medium text-white">Background :</h3>
          <button
            type="button"
            onClick={() => {
              setDisplayColorPicker(true);
            }}
            className="h-[20px] w-[60px] border-[2px] border-white"
            style={{
              backgroundColor: background,
            }}
          />
        </div>
        <div className="relative mt-1">
          <div className="absolute z-[1]">
            {displayColorPicker && (
              <>
                <div
                  className="fixed bottom-0 left-0 right-0 top-0"
                  onClick={() => {
                    setDisplayColorPicker(false);
                  }}
                />
                <Controller
                  control={control}
                  name="background"
                  render={({ field: { onChange, value, ...rest } }) => {
                    return (
                      <SketchPicker
                        color={value}
                        onChange={(color) => {
                          onChange(color.hex);
                        }}
                        {...rest}
                        className="text-white"
                        styles={{
                          default: {
                            picker: {
                              background: '#ffffff',
                              width: '230px',
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium text-white">Package upload</h3>

        <p className="mb-[16px] text-sm text-default-500">Format: GLB.</p>

        <Controller
          control={control}
          name="model"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...rest } }) => {
            return (
              <InputFile
                {...rest}
                files={value as File[]}
                multiple={false}
                onChangeFiles={(files) => {
                  onChange(files);
                }}
              />
            );
          }}
        />
        <p className="min-h-[20px] text-sm text-red-400">
          {errors.model?.message as ReactNode}
        </p>
        <div className="flex justify-center">
          {previewModel && !errors.model && (
            <Show3DModal
              title={name || 'Preview'}
              background={background}
              url={previewModel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PackageUploadTab;
