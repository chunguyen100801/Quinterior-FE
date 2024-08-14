import AccountDropdown from '@/components/AccountDropdown';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import { validateRequest } from '@/lucia-auth/lucia';
import { Button, Navbar, NavbarContent } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

// const menuItems = [
//   { name: 'Home', link: '/home' },
//   { name: 'Product', link: '/product' },
//   { name: 'Pricing', link: '/pricing' },
//   { name: 'About', link: '/about' },
// ];
async function NavBar() {
  const { session } = await validateRequest();
  let user;
  if (session) {
    user = await getUserInFo();
  }

  return (
    <Navbar
      shouldHideOnScroll
      style={
        {
          '--navbar-height': '3rem',
        } as React.CSSProperties
      }
      classNames={{
        base: 'flex-col border-b border-divider py-3',
        wrapper: 'max-w-[1230px]',
      }}
    >
      <NavbarContent className="flex-col !justify-center gap-5 ">
        <div className="flex w-full items-center justify-between">
          <Link
            href={'/find-ideas'}
            className="flex h-full items-center justify-center gap-2"
          >
            <Image src="/logo.svg" height={30} width={30} alt="app logo" />
            <h1 className="text-2xl font-bold  text-foreground">QUINTERIOR</h1>
          </Link>
          {user && (
            <div className="flex gap-[3rem] font-semibold ">
              <Link href="/generate-your-ideas" color="foreground">
                Generate Ideas
              </Link>
              <Link href="/find-ideas" color="foreground">
                Find Ideas
              </Link>
              <Link href="/floor-plans" color="foreground">
                Floor Plans
              </Link>
              <Link href="/marketplace" color="foreground">
                3D Collection
              </Link>
            </div>
          )}
          <div className="flex  items-center justify-end gap-1">
            {user ? (
              <div className=" scale-80">
                <AccountDropdown user={user} />
              </div>
            ) : (
              <Link href="/auth">
                <Button color="primary" size="md" className="font-medium">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </NavbarContent>
    </Navbar>
  );
}

export default NavBar;
