'use client';
import { ManagePackageFormSchemaType } from '@/utils/rules/package.rule';
import { Input } from '@nextui-org/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import TextEditor from '@/components/TextEditor';

function PackageDetailsTab() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ManagePackageFormSchemaType>();
  const descriptionController = useController({ control, name: 'description' });
  const widthController = useController({ control, name: 'modelData.width' });
  const heightController = useController({ control, name: 'modelData.height' });
  const depthController = useController({ control, name: 'modelData.depth' });

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h3 className="mb-[8px] text-base font-medium text-white">
          Description
        </h3>

        <TextEditor
          value={descriptionController.field.value}
          onChange={descriptionController.field.onChange}
        />
        <p className="min-h-[20px] text-sm text-red-400">
          {errors.description?.message}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <h3 className="mb-[8px] text-base font-medium text-white">
            Width (cm)
          </h3>
          <Input
            {...widthController.field}
            value={widthController.field.value}
            onValueChange={widthController.field.onChange}
            placeholder="Width"
            className="text-white"
          />
          <p className="min-h-[20px] text-sm text-red-400">
            {errors.modelData?.width?.message}
          </p>
        </div>

        <div className="col-span-4">
          <h3 className="mb-[8px] text-base font-medium text-white">
            Height (cm)
          </h3>
          <Input
            {...heightController.field}
            value={heightController.field.value}
            onValueChange={heightController.field.onChange}
            placeholder="Height"
            className="text-white"
          />
          <p className="min-h-[20px] text-sm text-red-400">
            {errors.modelData?.height?.message}
          </p>
        </div>

        <div className="col-span-4">
          <h3 className="mb-[8px] text-base font-medium text-white">
            Depth (cm)
          </h3>
          <Input
            {...depthController.field}
            value={depthController.field.value}
            onValueChange={depthController.field.onChange}
            placeholder="Depth"
            className="text-white"
          />
          <p className="min-h-[20px] text-sm text-red-400">
            {errors.modelData?.depth?.message}
          </p>
        </div>
        <div className="col-span-12">
          <p className="min-h-[20px] text-sm text-red-400">
            {errors.modelData?.message}
          </p>
        </div>
      </div>

      {/* <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <h3 className="mb-[8px] text-base font-medium text-white">
            Price (VND)
          </h3>
          <Input
            {...priceController.field}
            value={priceController.field.value}
            onValueChange={priceController.field.onChange}
            placeholder="Package price"
            className="text-white"
          />
          <p className="min-h-[20px] text-sm text-red-400">
            {errors.price?.message}
          </p>
        </div>

        <div className="col-span-6">
          <h3 className="mb-[8px] text-base font-medium text-white">
            Quantity
          </h3>
          <Input
            {...quantityController.field}
            value={quantityController.field.value}
            onValueChange={quantityController.field.onChange}
            placeholder="Quantity"
            className="text-white"
          />
          <p className="min-h-[20px] text-sm text-red-400">
            {errors.quantity?.message}
          </p>
        </div>
      </div> */}
    </div>
  );
}

export default PackageDetailsTab;
