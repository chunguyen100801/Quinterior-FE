'use client';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Select, { TSelectItem } from 'src/components/Select';
import {
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { AssetQueryParams } from 'src/hooks/useAssetQueryParams';
import { ColumnType } from './PackagesTable';
import { ELimit } from 'src/constants/enum';
import useDebounce from 'src/hooks/useDebounce';

interface Props {
  queryParams: AssetQueryParams;
  itemCount: number;
  columns: ColumnType[];
  visibleColumns: ColumnType[];
  setColumns: Dispatch<SetStateAction<ColumnType[]>>;
}

function TableTopContent({
  queryParams,
  columns,
  visibleColumns,
  itemCount,
  setColumns,
}: Props) {
  const { handleSearchParams } = useSearchQueryParams();
  const [searchValue, setSearchValue] = useState(queryParams.search || '');
  const debounceSearchValue = useDebounce(searchValue);

  const columnKeys = useMemo(() => {
    return visibleColumns.map((column) => column.uid);
  }, [visibleColumns]);

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
      <div className="flex items-center justify-between gap-3">
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
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={columnKeys}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                setColumns(
                  columns.map((column) => ({
                    ...column,
                    visible: Array.from(keys).includes(column.uid),
                  }))
                );
              }}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-small font-medium text-white">
          Total {itemCount} packages
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
