import Logo from '@/assets/logo.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function AppLogo() {
  return (
    <>
      <div className="absolute left-[50%] top-[2%] z-10 hidden translate-x-[-50%]  gap-[5px] lg:flex  xl:left-[6rem] xl:top-[3rem] xl:translate-x-[0%]">
        <Image src={Logo} alt="logo"></Image>
        <Link className="mt-[3px] text-large font-extrabold" href="/">
          QUINTERIOR
        </Link>
      </div>
      <div className="  relative  flex h-[10vh] items-center justify-center lg:hidden lg:justify-start lg:pl-[4rem]  ">
        <div className=" absolute flex items-center justify-center gap-1">
          <Image src={Logo} alt="logo"></Image>
          <Link className="mt-[3px] text-large font-extrabold" href="/">
            QUINTERIOR
          </Link>
        </div>
      </div>
    </>
  );
}
