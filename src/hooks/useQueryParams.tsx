'use client';
import { useSearchParams } from 'next/navigation';

function useQueryParams() {
  const searchParams = useSearchParams();
  const queryParams = Object.fromEntries(searchParams);

  return queryParams;
}

export default useQueryParams;
