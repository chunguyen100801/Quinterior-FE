import { omitBy } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

function useSearchQueryParams() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchParams = useCallback(
    <T extends Record<string, string>>(
      queryConfig: T,
      params:
        | { key: keyof T; value: string }
        | { key: keyof T; value: string }[]
    ) => {
      let newParams;
      if (Array.isArray(params)) {
        newParams = params.reduce((acc, param) => {
          return {
            ...acc,
            [param.key]: param.value,
          };
        }, {});
      } else {
        newParams = { [params.key]: params.value };
      }

      const newQueryConfig = omitBy(
        {
          ...queryConfig,
          ...newParams,
        },
        (value) => value === ''
      );

      const searchParams = new URLSearchParams(newQueryConfig);

      router.replace(`${pathname}?${searchParams.toString()}`);
    },
    [pathname, router]
  );

  return {
    handleSearchParams,
  };
}

export default useSearchQueryParams;
