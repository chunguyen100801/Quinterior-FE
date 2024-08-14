'use client';

import { Pagination } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function WorkSpacePagination({
  total,
  page,
}: {
  total: number;
  page: number;
}) {
  const [currentPage, setCurrentPage] = useState<number>(page);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const onChangePage = (page: number) => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', page.toString());
    const query = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : '';
    router.replace(`${pathname}${query}`);
  };
  return (
    <>
      <Pagination
        className=" absolute  right-[50%]  translate-x-[50%] "
        showControls
        showShadow
        total={total}
        page={currentPage}
        onChange={onChangePage}
      />
    </>
  );
}
