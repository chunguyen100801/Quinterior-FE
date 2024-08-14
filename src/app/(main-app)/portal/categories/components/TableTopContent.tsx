'use client';
import { Button, Input } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';
import { ColumnType } from './CategoriesTable';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';
import { useEffect, useMemo, useState } from 'react';
import useDebounce from 'src/hooks/useDebounce';
import Select, { TSelectItem } from 'src/components/Select';
import { ELimit } from 'src/constants/enum';
import { CategoryQueryParams } from 'src/hooks/useCategoryQueryParams';

interface Props {
  queryParams: CategoryQueryParams;
  itemCount: number;
  columns: ColumnType[];
  handleOpenCreateModal: () => void;
}

function TableTopContent({
  itemCount,
  queryParams,
  handleOpenCreateModal,
}: Props) {
  const { handleSearchParams } = useSearchQueryParams();
  const [searchValue, setSearchValue] = useState(queryParams.search || '');
  const debounceSearchValue = useDebounce(searchValue);

  useEffect(() => {
    handleSearchParams(queryParams, {
      key: 'search',
      value: debounceSearchValue,
    });
  }, [debounceSearchValue, handleSearchParams, queryParams]);

  const handleChangeLimit = (value: string) => {
    handleSearchParams(queryParams, [
      {
        key: 'take',
        value,
      },
      {
        key: 'page',
        value: '1',
      },
    ]);
  };

  const limitOptions: TSelectItem[] = [
    {
      label: ELimit.FIVE,
      value: ELimit.FIVE,
      onClick: () => {
        handleChangeLimit(ELimit.FIVE);
      },
    },
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

  const defaultLimitOption = useMemo(() => {
    return limitOptions.find((option) => option.value === queryParams.take);
  }, [queryParams.take]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={searchValue}
          onClear={() => {
            setSearchValue('');
          }}
          onValueChange={(value) => {
            setSearchValue(value);
          }}
        />

        <Button
          color="primary"
          radius="none"
          className="rounded-[4px] text-sm font-medium text-white"
          onClick={handleOpenCreateModal}
        >
          Create a category
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-small font-medium text-white">
          Total {itemCount} categories
        </span>
        <label className="flex items-center text-small font-medium text-white">
          Rows per page:
          <Select
            data={limitOptions}
            defaultItem={defaultLimitOption}
            wrapperClassName="ml-2 w-[61px]"
          />
        </label>
      </div>
    </div>
  );
}

export default TableTopContent;
