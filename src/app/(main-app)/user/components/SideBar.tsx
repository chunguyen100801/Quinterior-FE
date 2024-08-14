'use client';
import { Button } from '@nextui-org/react';
import { LockKeyhole, MapPinned, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

const BASE_URL = '/user';

type SidebarItem = {
  name: string;
  icon: JSX.Element;
  link: string;
  rightIcon?: JSX.Element;
};

const data: SidebarItem[][] = [
  [
    {
      name: 'Profile',
      icon: <UserIcon width={20} height={20} strokeWidth={1} />,
      link: BASE_URL + '/profile',
    },
    {
      name: 'Addresses',
      icon: <MapPinned width={20} height={20} strokeWidth={1} />,
      link: BASE_URL + '/address',
    },
    // {
    //   name: 'Purchased Products',
    //   icon: <ShoppingCart width={20} height={20} strokeWidth={1} />,
    //   link: BASE_URL + '/purchased-products',
    // },
    // {
    //   name: 'My Purchase',
    //   icon: <ReceiptText width={20} height={20} strokeWidth={1} />,
    //   link: BASE_URL + '/my-purchase',
    // },
    {
      name: 'Change Password',
      icon: <LockKeyhole width={20} height={20} strokeWidth={1} />,
      link: BASE_URL + '/change-password',
    },
  ],
  [],
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 flex-col gap-[20px] py-[16px]">
      {data.map((group, index) => {
        return (
          <div key={index} className="flex flex-col gap-1">
            {group.map((item, index) => {
              return (
                <Link key={index} href={item.link}>
                  <Button
                    color="default"
                    variant="light"
                    className={twMerge(
                      'w-full justify-start gap-[10px] rounded-[4px] px-[16px] font-medium',
                      pathname === item.link && 'bg-[#18181b]'
                    )}
                    radius="none"
                  >
                    {item.icon}
                    {item.name}
                    {item.rightIcon && (
                      <div className="ml-auto">{item.rightIcon}</div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
