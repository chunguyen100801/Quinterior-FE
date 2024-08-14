/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';
import { Pagination as PaginationLib } from '@nextui-org/react';
import React from 'react';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';

interface Props<TSearchParams extends Record<string, string>> {
  totalPages: number;
  searchParams: TSearchParams;
  enableScrollTop?: boolean;
}

function Pagination<TSearchParams extends Record<string, any>>({
  totalPages,
  searchParams,
  enableScrollTop = false,
}: Props<TSearchParams>) {
  const { handleSearchParams } = useSearchQueryParams();

  const handlePageChange = (page: number) => {
    handleSearchParams(searchParams, {
      key: 'page',
      value: page.toString(),
    });
    if (enableScrollTop) window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <PaginationLib
      page={Number(searchParams?.page || 1)}
      size="lg"
      isCompact
      showControls
      total={totalPages}
      initialPage={1}
      onChange={handlePageChange}
    />
  );
}

export default Pagination;
