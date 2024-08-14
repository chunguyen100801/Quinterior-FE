import { UserInFo } from '@/lucia-auth/auth-actions';
import Image from 'next/image';
import Link from 'next/link';
import AccountDropdown from '../../../../components/AccountDropdown';
import { PublisherInfoType } from 'src/types/publisher.type';

interface Props {
  user: UserInFo;
  storeProfile?: PublisherInfoType;
}

function Header({ user, storeProfile }: Props) {
  return (
    <header className="flex h-[60px] justify-between border-b border-divider px-[20px]">
      <div className="flex w-full items-center">
        <Link
          href={'/portal'}
          className="flex h-full items-center justify-center gap-2"
        >
          <Image src="/logo.svg" height={30} width={30} alt="app logo" />
          <h1 className="text-2xl font-bold">Publisher Portal</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <AccountDropdown isInPortal user={user} storeProfile={storeProfile} />
      </div>
    </header>
  );
}

export default Header;
