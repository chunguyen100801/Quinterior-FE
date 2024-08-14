import Link from 'next/link';
export default function Footer() {
  return (
    <div className=" flex  h-[20vh] w-full items-center justify-center ">
      <div className=" flex gap-[4rem] xl:gap-[10rem]">
        <div className="flex items-center justify-center">Quinterior</div>
        <div className="w-[1px] bg-gray-700"></div>
        <div className=" flex flex-col font-light">
          <Link href="#">About</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Pricing</Link>
        </div>
        <div className="w-[1px] bg-gray-700"></div>
        <div className=" flex flex-col font-extralight">
          <Link href="#">Term</Link>
          <Link href="#">Policy</Link>
          <Link href="#">Docs</Link>
        </div>
      </div>
    </div>
  );
}
