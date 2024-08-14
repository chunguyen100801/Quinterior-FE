'use client';
import { getCategoriesList } from '@/app/apis/category.api';
import { ManagePackageFormSchemaType } from '@/utils/rules/package.rule';
import { Select, SelectItem } from '@nextui-org/react';
import React, { useContext, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { ELimit } from 'src/constants/enum';
import { ManagePackageContext } from './ManagePackage';

function CategoriesListDropdown() {
  const { control } = useFormContext<ManagePackageFormSchemaType>();

  const { categoriesState, setCategoriesState } =
    useContext(ManagePackageContext);

  const [isOpen, setIsOpen] = useState(false);

  const handleLoadMore = async () => {
    try {
      if (!categoriesState?.userId) return;
      setCategoriesState((prev) => ({ ...prev, isLoading: true }));
      const categoriesRes = await getCategoriesList({
        sellerId: categoriesState.userId,
        page: String(categoriesState.page + 1),
        take: ELimit.FIFTY,
      });

      if (categoriesRes) {
        setCategoriesState((prev) => ({
          ...prev,
          data: [...prev.data, ...categoriesRes.data],
          page: categoriesRes.meta.page,
          hasMore: categoriesRes.meta.page < categoriesRes.meta.pageCount,
        }));
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setCategoriesState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: categoriesState?.hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
    onLoadMore: handleLoadMore,
  });

  return (
    <>
      <Controller
        control={control}
        name="categoryIds"
        render={({ field: { onChange, value, ...rest } }) => {
          return (
            <Select
              {...rest}
              scrollRef={scrollerRef}
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              isLoading={categoriesState?.isLoading}
              items={categoriesState?.data || []}
              label="Select a category"
              classNames={{
                value: 'font-medium',
                popoverContent: 'rounded-[4px]',
              }}
              onClick={() => {
                if (
                  !categoriesState?.data ||
                  categoriesState?.data.length === 0
                ) {
                  toast.warning(
                    'No category available. Please access the category page to create a new category.'
                  );
                }
              }}
              radius="sm"
              selectionMode="multiple"
              selectedKeys={value}
              onSelectionChange={(keys) => {
                onChange(Array.from(keys));
              }}
            >
              {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
            </Select>
          );
        }}
      />
    </>
  );
}

export default CategoriesListDropdown;
