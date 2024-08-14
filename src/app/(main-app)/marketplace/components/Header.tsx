import { getUserInFo } from '@/lucia-auth/auth-actions';
import { validateRequest } from '@/lucia-auth/lucia';
import {
  Button,
  Link as ButtonLink,
  Navbar,
  NavbarContent,
} from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react';
import AccountDropdown from '../../../../components/AccountDropdown';
import HeaderSearch from './HeaderSearch';

async function Header() {
  const { session } = await validateRequest();
  let user = null;
  if (session) {
    user = await getUserInFo();
  }

  return (
    <Navbar
      shouldHideOnScroll
      style={
        {
          '--navbar-height': '100px',
        } as React.CSSProperties
      }
      classNames={{
        base: 'flex-col border-b border-divider py-3',
        wrapper: 'max-w-[1230px]',
      }}
    >
      <NavbarContent className="flex-col !justify-center gap-5">
        <div className="flex w-full items-center justify-between">
          <Link
            href={'/marketplace'}
            className="flex h-full items-center justify-center gap-2"
          >
            <Image src="/logo.svg" height={30} width={30} alt="app logo" />
            <h1 className="text-2xl font-bold">3D Collection</h1>
          </Link>
          <Suspense>
            <HeaderSearch />
          </Suspense>
          <div className="flex min-w-[204px] items-center justify-end gap-1">
            {user ? (
              <>
                {/* <Tooltip
                  color="default"
                  showArrow
                  placement="bottom"
                  closeDelay={200}
                  content="My Assets"
                  classNames={{
                    content: ['text-sm font-medium'],
                  }}
                >
                  <Button
                    as={Link}
                    href="/user/my-purchase"
                    isIconOnly
                    color="default"
                    variant="light"
                    size="lg"
                    radius="full"
                  >
                    <FolderDown size={24} />
                  </Button>
                </Tooltip>

                <CartDropdown /> */}
                <AccountDropdown user={user} />
              </>
            ) : (
              <Link href="/auth">
                <Button color="primary" size="md" className="font-medium">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex w-full items-center gap-8">
          <ButtonLink
            color="foreground"
            href="/generate-your-ideas"
            className="text-base font-medium text-white"
          >
            Generate Ideas
          </ButtonLink>
          <ButtonLink
            color="foreground"
            href="/find-ideas"
            className="text-base font-medium text-white"
          >
            Find Idea
          </ButtonLink>
          <ButtonLink
            color="foreground"
            href="/floor-plans"
            className="text-base font-medium text-white"
          >
            Floor Plan
          </ButtonLink>
          <ButtonLink
            color="foreground"
            href="/portal"
            className="ml-auto text-base font-medium text-white"
          >
            Upload Models
          </ButtonLink>
        </div>
      </NavbarContent>
    </Navbar>
  );
}

export default Header;
