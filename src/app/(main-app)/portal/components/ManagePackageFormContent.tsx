import { Button, Input } from '@nextui-org/react';
import { PencilIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import HeaderTabs from './HeaderTabs';
import TabsContent from './TabsContent';
import { TabIndex } from './ManagePackage';
import { ManagePackageFormSchemaType } from '@/utils/rules/package.rule';

interface Props {
  type: 'view' | 'edit' | 'create';
  isLoading: boolean;
}

function ManagePackageFormContent({ isLoading, type }: Props) {
  const [activeTab, setActiveTab] = useState(TabIndex.PackageUpload);

  const {
    control,
    formState: { errors },
  } = useFormContext<ManagePackageFormSchemaType>();

  return (
    <>
      <header className="px-[24px]">
        <div className="mb-[16px] flex items-center justify-between pt-[24px]">
          <div className="max-w-[495px] flex-1">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                  type="text"
                  placeholder="Package name"
                  className="max-w-[495px] rounded-[4px] font-medium text-white"
                  classNames={{
                    input: 'text-base font-medium',
                  }}
                  endContent={<PencilIcon width={20} height={20} />}
                />
              )}
            />

            <p className="min-h-[20px] text-sm text-red-400">
              {errors.name?.message}
            </p>
          </div>
          {type !== 'view' && (
            <Button
              color="primary"
              className={twMerge(
                'rounded-[4px] font-medium text-white',
                isLoading && 'cursor-not-allowed opacity-80'
              )}
              type="submit"
              disabled={isLoading}
            >
              Submit
            </Button>
          )}
        </div>

        <HeaderTabs setActiveTab={setActiveTab} activeTab={activeTab} />
      </header>
      <main>
        <div className="h-[20px] bg-background/30" />
        <TabsContent activeTab={activeTab} />
      </main>
    </>
  );
}

export default ManagePackageFormContent;
