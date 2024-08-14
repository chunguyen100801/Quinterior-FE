'use client';
import Select, { TSelectItem } from 'src/components/Select';
import { useMemo } from 'react';
import { ELimit, EOrderType } from 'src/constants/enum';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';
import { MetaType } from 'src/types/utils.type';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';

interface Props {
  meta?: MetaType;
}

function SortAssetsList({ meta }: Props) {
  const { handleSearchParams } = useSearchQueryParams();
  const queryParams = useAssetQueryParams();

  // const handleSort = (value: string) => {
  //   handleSearchParams({
  //     key: 'sort_by',
  //     value,
  //   });
  // };

  const handleOrder = (value: string) => {
    handleSearchParams(queryParams, {
      key: 'order',
      value,
    });
  };

  const handleChangeLimit = (value: string) => {
    handleSearchParams(queryParams, {
      key: 'take',
      value,
    });
  };

  // const sortOptions: TSelectItem[] = [
  //   {
  //     label: 'Popularity',
  //     value: ESortBy.POPULARITY,
  //     onClick: () => {
  //       handleSort(ESortBy.POPULARITY);
  //     },
  //   },
  //   {
  //     label: 'Rating',
  //     value: ESortBy.RATING,
  //     onClick: () => {
  //       handleSort(ESortBy.RATING);
  //     },
  //   },
  //   {
  //     label: 'Name',
  //     value: ESortBy.NAME,
  //     onClick: () => {
  //       handleSort(ESortBy.NAME);
  //     },
  //   },
  //   {
  //     label: 'Price',
  //     value: ESortBy.PRICE,
  //     onClick: () => {
  //       handleSort(ESortBy.PRICE);
  //     },
  //   },
  // ];

  const orderOptions: TSelectItem[] = [
    {
      label: 'Asc',
      value: EOrderType.ASC,
      onClick: () => {
        handleOrder(EOrderType.ASC);
      },
    },
    {
      label: 'Desc',
      value: EOrderType.DESC,
      onClick: () => {
        handleOrder(EOrderType.DESC);
      },
    },
  ];

  const limitOptions: TSelectItem[] = [
    {
      label: ELimit.TEN,
      value: ELimit.TEN,
      onClick: () => {
        handleChangeLimit(ELimit.TEN);
      },
    },
    {
      label: ELimit.TWENTY,
      value: ELimit.TWENTY,
      onClick: () => {
        handleChangeLimit(ELimit.TWENTY);
      },
    },
    {
      label: ELimit.FIFTY,
      value: ELimit.FIFTY,
      onClick: () => {
        handleChangeLimit(ELimit.FIFTY);
      },
    },
  ];

  // const defaultSortOption = sortOptions.find(
  //   (option) => option.value === queryParams.sort_by
  // );

  const defaultOrderOption = useMemo(() => {
    return orderOptions.find((option) => option.value === queryParams.order);
  }, [queryParams.order]);

  const defaultLimitOption = useMemo(() => {
    return limitOptions.find((option) => option.value === queryParams.take);
  }, [queryParams.take]);

  if (!meta) return null;

  return (
    <div>
      <div className="flex items-center">
        <p className="text-sm">
          <span className="font-bold">
            {meta.itemCount !== 0
              ? (meta.page - 1) * meta.take + 1
              : meta.itemCount}
            -
            {meta.page * meta.take > meta.itemCount
              ? meta.itemCount
              : meta.page * meta.take}
          </span>
          <span> of </span>
          <span className="font-bold">{meta.itemCount}</span>
          <span> results</span>
        </p>
        <div className="ml-auto flex items-center gap-4">
          {/* <div className="flex items-center gap-3">
            <p className="text-sm text-white">Sort by</p>
            <Select
              data={sortOptions}
              defaultItem={defaultSortOption}
              wrapperClassName="w-[114px]"
            />
          </div> */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-white">Order</p>
            <Select
              data={orderOptions}
              defaultItem={defaultOrderOption}
              wrapperClassName="w-[80px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-white">View results</p>
            <Select
              data={limitOptions}
              defaultItem={defaultLimitOption}
              wrapperClassName="w-[61px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortAssetsList;
