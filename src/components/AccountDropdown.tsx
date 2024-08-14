'use client';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { User as UserIcon, LogOut, ShoppingBag, Store } from 'lucide-react';

import { UserInFo, logout } from '@/lucia-auth/auth-actions';
import { useRouter } from 'next/navigation';
import { PublisherInfoType } from 'src/types/publisher.type';

interface Props {
  user: UserInFo;
  isInPortal?: boolean;
  storeProfile?: PublisherInfoType;
}

const AccountDropdown = ({ user, isInPortal = false, storeProfile }: Props) => {
  const router = useRouter();
  const avatarName = (user?.firstName + ' ' + user?.lastName)
    .split(' ')
    .map((x) => x[0])
    .join('')
    .toUpperCase();

  return isInPortal ? (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: 'before:bg-default-200', // change arrow background
        content: 'p-0 border-small border-divider bg-background',
      }}
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Avatar
          name={avatarName.toUpperCase()}
          size="md"
          classNames={{
            base: 'h-[48px] w-[48px] cursor-pointer select-none text-base',
            name: 'text-sm font-medium',
          }}
          src={user?.avatar?.toString()}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Account Menu"
        // disabledKeys={['profile']}
        className="w-[300px] p-0"
        itemClasses={{
          base: [
            'h-[48px]',
            'rounded-none',
            'transition-opacity',
            'data-[hover=true]:text-foreground',
            'data-[hover=true]:bg-default-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
      >
        <DropdownItem
          key="profile"
          className="h-min gap-2 pl-[16px] pt-[16px]  opacity-100"
          href="/user/profile"
        >
          <User
            name={user?.firstName + ' ' + user?.lastName}
            description={user?.email}
            classNames={{
              name: 'text-base font-medium text-white',
              description: 'text-[#9B9B9A] text-[12px] font-normal',
            }}
            avatarProps={{
              size: 'md',
              src: user?.avatar?.toString(),
            }}
          />
        </DropdownItem>

        <DropdownItem
          key="marketplace"
          startContent={<ShoppingBag width={40} size={24} />}
          href="/marketplace"
        >
          <p className="text-sm font-medium">3D Collection</p>
        </DropdownItem>

        <DropdownItem
          key="my-store"
          startContent={<Store width={40} size={24} />}
          href={`/marketplace/store/${storeProfile?.id}`}
        >
          <p className="text-sm font-medium">My Products</p>
        </DropdownItem>

        <DropdownItem
          key="logout"
          startContent={<LogOut width={40} size={24} />}
          onPress={async () => {
            await logout();
          }}
        >
          <p className="text-sm font-medium">Sign Out</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: 'before:bg-default-200', // change arrow background
        content: 'p-0 border-small border-divider bg-background',
      }}
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Avatar
          name={avatarName.toUpperCase()}
          size="md"
          classNames={{
            base: 'h-[48px] w-[48px] cursor-pointer select-none text-base',
            name: 'text-sm font-medium',
          }}
          src={user?.avatar?.toString()}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Account Menu"
        // disabledKeys={['profile']}
        className="w-[300px] p-0"
        itemClasses={{
          base: [
            'h-[48px]',
            'rounded-none',
            'transition-opacity',
            'data-[hover=true]:text-foreground',
            'data-[hover=true]:bg-default-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
      >
        <DropdownItem
          key="profile"
          className="h-min gap-2 pl-[16px] pt-[16px]  opacity-100"
          href="/user/profile"
        >
          <User
            name={user?.firstName + ' ' + user?.lastName}
            description={user?.email}
            classNames={{
              name: 'text-base font-medium text-white',
              description: 'text-[#9B9B9A] text-[12px] font-normal',
            }}
            avatarProps={{
              size: 'md',
              src: user?.avatar?.toString(),
            }}
          />
        </DropdownItem>

        {/* <DropdownItem
          key="my-assets"
          startContent={<BookDown width={40} size={24} />}
          href="/user/my-purchase"
        >
          <p className="text-sm font-medium">My Assets</p>
        </DropdownItem> */}
        <DropdownItem
          key="profile2"
          startContent={<UserIcon width={40} size={24} />}
          href="/user/profile"
        >
          <p className="text-sm font-medium">Profile</p>
        </DropdownItem>
        <DropdownItem
          key="logout"
          startContent={<LogOut width={40} size={24} />}
          onPress={async () => {
            await logout();
            router.push('/auth');
          }}
        >
          <p className="text-sm font-medium">Sign Out</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AccountDropdown;
