'use client';
import { Input } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useDebounce from 'src/hooks/useDebounce';
import useOrderQueryParams from 'src/hooks/useOrderQueryParams';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';

function SearchOrders() {
  const queryParams = useOrderQueryParams({
    page: '',
    take: '',
  });
  const { handleSearchParams } = useSearchQueryParams();
  const [searchValue, setSearchValue] = useState(queryParams.search || '');
  const debounceSearchValue = useDebounce(searchValue);

  useEffect(() => {
    handleSearchParams(queryParams, {
      key: 'search',
      value: debounceSearchValue,
    });
  }, [debounceSearchValue]);

  useEffect(() => {
    setSearchValue(queryParams.search || '');
  }, [queryParams.search]);

  return (
    <Input
      isClearable
      className="w-full sm:max-w-[44%]"
      placeholder="Search by code"
      startContent={<SearchIcon />}
      value={searchValue}
      onClear={() => {
        setSearchValue('');
      }}
      onValueChange={(value) => {
        setSearchValue(value);
      }}
    />
  );
}

export default SearchOrders;
