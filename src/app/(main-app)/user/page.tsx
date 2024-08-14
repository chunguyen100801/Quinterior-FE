'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const BASE_URL = '/user';
const urlUser = [
  {
    link: BASE_URL + '/profile',
  },
  {
    link: BASE_URL + '/purchased-products',
  },
  {
    link: BASE_URL + '/my-Purchase',
  },
  {
    link: BASE_URL + '/change-password',
  },
];
export default function Page() {
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (pathName === BASE_URL) {
      router.push(urlUser[0].link);
    }
  }, [pathName, router]);
  return <></>;
}
