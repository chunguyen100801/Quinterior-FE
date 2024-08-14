import AppLogo from '@/app/auth/components/app-logo';
import AmbientLight1 from '@/assets/home/ambient-light-1.png';
import Image from 'next/image';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppLogo></AppLogo>
      <div className=" isolate  h-fit min-h-[90vh] w-full overflow-auto  bg-gradient-to-b from-black to-[#010420] py-[5rem]  lg:h-[100vh]   lg:px-[6rem]  ">
        <div className=" user-select-none pointer-events-none absolute left-1/2 top-1/2 z-[-1]  translate-x-[-50%] translate-y-[-50%] transform ">
          <Image src={AmbientLight1} alt="ambientlight"></Image>
        </div>
        {children}
      </div>
    </div>
  );
}
