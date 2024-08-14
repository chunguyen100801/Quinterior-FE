import { Button } from '@nextui-org/react';
import React from 'react';
import Pagination from 'src/components/Pagination';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';
import { MetaType } from 'src/types/utils.type';

interface Props<T> {
  meta: MetaType;
  queryParams: T;
}

function TableBottomContent<T extends Record<string, string>>({
  meta,
  queryParams,
}: Props<T>) {
  const { handleSearchParams } = useSearchQueryParams();

  const onNextPage = () => {
    const pageNum = Number(queryParams.page);
    if (pageNum < meta.pageCount) {
      handleSearchParams(queryParams, {
        key: 'page',
        value: (pageNum + 1).toString(),
      });
    }
  };

  const onPreviousPage = () => {
    const pageNum = Number(queryParams.page);
    if (pageNum > 1) {
      handleSearchParams(queryParams, {
        key: 'page',
        value: (pageNum - 1).toString(),
      });
    }
  };

  return (
    <div className="flex items-center justify-between px-2 py-2">
      {meta && meta.pageCount > 1 && meta.itemCount > 0 && (
        <>
          <Pagination totalPages={meta.pageCount} searchParams={queryParams} />
          <div className="hidden w-[30%] justify-end gap-2 sm:flex">
            <Button
              isDisabled={meta.pageCount === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
              className="font-medium text-white"
            >
              Previous
            </Button>
            <Button
              isDisabled={meta.pageCount === 1}
              size="sm"
              variant="flat"
              onPress={onNextPage}
              className="font-medium text-white"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default TableBottomContent;
