import Checkicon from '@/assets/home/check-icon.svg';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
export default function PriceBox({
  name,
  details,
  bgColor,
  shadowColor,
  nav,
}: {
  name: string;
  details: string[];
  bgColor: string;
  shadowColor: string;
  nav: string;
}) {
  return (
    <div
      className={`flex h-fit flex-col items-center justify-between rounded-[1.14069rem] p-[2rem] xl:h-fit   xl:w-full `}
      style={{
        backgroundColor: bgColor,
        boxShadow: `0px 0px 91.25442px 0px ${shadowColor}`,
      }}
    >
      <div className=" flex  w-full flex-col items-center justify-center">
        {/* <span className="text-[2rem] font-bold">{packName}</span> */}
        <span className="text-center text-[3rem] font-extrabold">{name}</span>
        <div className=" flex w-[80%] flex-col gap-5">
          {details.map((sentence, index) => (
            <div
              key={index + 'pack'}
              className="flex w-full items-start gap-[1rem] "
            >
              <Image src={Checkicon} alt="check-icon" className="mt-[5px]" />
              <span className="block w-full gap-2  text-[1.2rem]">
                {sentence}{' '}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Button
        className=" mt-4  w-full bg-white p-[1rem] text-[1rem] font-bold text-black"
        as={Link}
        href={nav}
      >
        Try now !
      </Button>
    </div>
  );
}
