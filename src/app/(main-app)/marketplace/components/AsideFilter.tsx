'use client';
import { getCategoriesList } from '@/app/apis/category.api';
import { queryStringValueToObject } from '@/utils/utils-client';
import { Checkbox, Skeleton } from '@nextui-org/react';
import { Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';
import { CategoryItem } from 'src/types/category.type';
import { twMerge } from 'tailwind-merge';
import SearchImage from './SearchImage';
function CategoriesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="w-fullrounded-lg">
          <div className="h-[20px] w-full rounded-lg bg-default-200"></div>
        </Skeleton>
      ))}
    </div>
  );
}

function AsideFilter({ sellerId = null }: { sellerId?: number | null }) {
  const { handleSearchParams } = useSearchQueryParams();
  const queryParams = useAssetQueryParams();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const categoryParams = useMemo(() => {
    if (!queryParams.categoryIds) return [];
    return queryParams.categoryIds.split(',');
  }, [queryParams.categoryIds]);

  const rating = useMemo(() => {
    if (!queryParams.rating) return 0;
    const rating = queryStringValueToObject(queryParams.rating);
    return +rating?.lte;
  }, [queryParams.rating]);

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    const res = sellerId
      ? await getCategoriesList({ sellerId })
      : await getCategoriesList();
    if (res) setCategories(res.data);
    setIsLoadingCategories(false);
  }, [sellerId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleClearFilters = () => {
    handleSearchParams(queryParams, [
      {
        key: 'categoryIds',
        value: '',
      },
      {
        key: 'price',
        value: '',
      },
      {
        key: 'page',
        value: '1',
      },
    ]);
  };

  return (
    <>
      <SearchImage />
      <div className="flex items-center justify-end py-4">
        <button
          className="text-base text-[#66a2f0] transition-opacity hover:opacity-80"
          onClick={handleClearFilters}
        >
          Clear filters
        </button>
      </div>
      {/* Begin - Category section */}
      <div className="border-t border-divider py-5">
        <h3 className="text-base font-medium text-white">Categories</h3>
        <div className="mt-3 flex flex-col gap-4">
          {isLoadingCategories && <CategoriesSkeleton />}
          {!isLoadingCategories &&
            categories.length > 0 &&
            categories.slice(0, 5).map((category) => (
              <Checkbox
                key={category.id}
                radius="none"
                size="sm"
                classNames={{
                  label: 'text-sm text-[#ffffffd9] ml-1',
                }}
                isSelected={categoryParams.includes(String(category.id))}
                onChange={(e) => {
                  let newCategoryParams = [...categoryParams];
                  if (
                    e.target.checked &&
                    !newCategoryParams.includes(String(category.id))
                  ) {
                    newCategoryParams.push(String(category.id));
                  } else {
                    newCategoryParams = newCategoryParams.filter(
                      (item) => item !== String(category.id)
                    );
                  }
                  handleSearchParams(queryParams, [
                    {
                      key: 'categoryIds',
                      value: newCategoryParams.join(','),
                    },
                    {
                      key: 'page',
                      value: '1',
                    },
                  ]);
                }}
              >
                {category.name}
              </Checkbox>
            ))}
        </div>
      </div>
      {/* End - Category section */}

      {/* Begin - Pricing section */}
      {/* <div className="border-t border-divider py-5">
        <h3 className="text-base font-medium text-white">Pricing</h3>
        <Suspense>
          <PriceController
            onSearchSubmit={(data) => {
              handleSearchParams(queryParams, [
                {
                  key: 'price',
                  value: `gte:${data.price_min},lte:${data.price_max}`,
                },
                {
                  key: 'page',
                  value: '1',
                },
              ]);
            }}
          />
        </Suspense>
      </div> */}
      {/* End - Pricing section */}

      {/* Begin - Ratings section */}
      <div className="border-t border-divider py-5">
        <h3 className="text-base font-medium text-white">Ratings</h3>
        <div className="mt-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  color="#fff"
                  className={twMerge(
                    'cursor-pointer',
                    index < rating && 'fill-white'
                  )}
                  onClick={() => {
                    handleSearchParams(queryParams, [
                      {
                        key: 'rating',
                        value: `lte:${index + 1},gte:${index + 1}`,
                      },
                      {
                        key: 'page',
                        value: '1',
                      },
                    ]);
                  }}
                />
              ))}
            </div>
            <button
              className="text-sm text-[#66a2f0] transition-opacity hover:opacity-80"
              onClick={() => {
                handleSearchParams(queryParams, [
                  {
                    key: 'rating',
                    value: '',
                  },
                  {
                    key: 'page',
                    value: '1',
                  },
                ]);
              }}
            >
              Clear rating
            </button>
          </div>
        </div>
      </div>
      {/* End - Ratings section */}
    </>
  );
}

export default AsideFilter;
