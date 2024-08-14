'use client';
import { Button } from '@nextui-org/react';
import { Boxes, Info, Package, PlusCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

const BASE_URL = '/portal';

type SidebarItem = {
  name: string;
  icon: JSX.Element;
  link: string;
  rightIcon?: JSX.Element;
};

const data: SidebarItem[][] = [
  [
    {
      name: 'Create a package',
      icon: <PlusCircle width={20} height={20} />,
      link: BASE_URL + '/create',
    },
  ],
  [
    {
      name: 'All packages',
      icon: <Package width={20} height={20} />,
      link: BASE_URL,
    },
    {
      name: 'Categories',
      icon: <Boxes width={20} height={20} />,
      link: BASE_URL + '/categories',
    },
    // {
    //   name: 'Orders',
    //   icon: <NotepadTextIcon width={20} height={20} />,
    //   link: BASE_URL + '/orders',
    // },
    // {
    //   name: 'Analytics',
    //   icon: <BarChart3 width={20} height={20} />,
    //   link: BASE_URL + '/analytics',
    // },
  ],
  [
    {
      name: 'Profile',
      icon: <User width={20} height={20} />,
      link: BASE_URL + '/profile',
      rightIcon: <Info width={20} height={20} color="#4147E6" />,
    },
  ],
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-[208px] shrink-0 flex-col gap-[20px] bg-secondary2 px-[10px] py-[16px]">
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
                      pathname === item.link && 'bg-[#3f3f4666]'
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
    </nav>
  );
}

export default Sidebar;
