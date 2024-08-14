import AutoImgAi from '@/app/(marketting)/components/auto-img-ai';
import AmbientLight1 from '@/assets/home/ambient-light-1.png';
import AmbientLight2 from '@/assets/home/ambient-light-2.png';
import AmbientLight3 from '@/assets/home/create-your-space-ambientlight.png';
import FindIdeas from '@/assets/home/findidea.png';
import AmbientLight4 from '@/assets/home/market-place-ambientlight.png';
import Market from '@/assets/home/market.png';
import TakePhoto from '@/assets/home/takephoto.png';
import { Button } from '@nextui-org/react';

import PriceBox from '@/app/(marketting)/components/price-box';
import LogoLarge from '@/assets/home/logo-large.svg';
import OurServiceImg from '@/assets/home/our-services.png';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import AnimatedDiv from './components/motion';
export default async function Home() {
  return (
    <div>
      <div className=" relative isolate flex h-fit w-full items-center justify-center  p-[4rem]  lg:px-[6rem]  2xl:h-[calc(100vh-64px)] ">
        <Image
          className="user-select-none pointer-events-none absolute left-1/2 top-1/2  -z-10 translate-x-[-50%] translate-y-[-50%] transform "
          src={AmbientLight1}
          alt="ambientlight"
        ></Image>
        <AnimatedDiv
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className=" z-10 mt-[2rem] grid grid-cols-1 items-center justify-center  gap-[1rem] md:gap-[4rem] 2xl:grid-cols-[3fr_2fr] 2xl:px-[4rem] ">
            <div className="flex flex-col md:h-fit ">
              <span className="font-inter mt-[2rem] text-[3rem] font-extrabold leading-[112%] tracking-[-0.14063rem]   md:mt-[0rem] md:text-[5rem] ">
                Your premier <br />
                <span className=" font-inter  bg-gradient-to-r from-[#0CC8FF] to-[#9260FF] bg-clip-text font-extrabold leading-[112%] tracking-[-0.14063rem] text-transparent">
                  Personal
                </span>{' '}
                interior <br />
                Design playground
              </span>
              <div className="font-inter my-[0.6rem]    font-bold sm:text-[1rem] md:mt-[1rem] md:h-fit md:text-[1.5rem]  md:leading-[132%] ">
                We believe that everyone deserves to have a space that reflects
                their personality and style.
              </div>
              <Button
                color="primary"
                className=" mt-[1.5rem] w-fit self-center text-large font-bold md:self-start "
                href="/generate-your-ideas"
                as={Link}
              >
                Get Started
              </Button>
            </div>
            <div>
              <Suspense fallback={<p>Loading feed...</p>}>
                <AutoImgAi></AutoImgAi>
              </Suspense>
            </div>
          </div>
        </AnimatedDiv>
      </div>
      {/* ///////////////////////////////////////////////////// */}
      <div className="relative isolate flex h-fit w-full items-center justify-center    px-[4rem] py-[5rem]  lg:px-[6rem] 2xl:h-[calc(100vh-64px)]">
        <AnimatedDiv
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} // Trigger once when 10% of the element is visible
          transition={{ duration: 0.5 }}
          className=" z-[1] flex flex-col items-center justify-center "
        >
          <Image
            className="user-select-none pointer-events-none basis-0 scale-50 transform lg:scale-100 "
            src={LogoLarge}
            alt="logoLarge"
          ></Image>

          <span className="font-inter mt-[0.1rem] basis-1 text-center  text-[2rem]  leading-[112%] tracking-[0.02rem]    lg:text-[5rem] ">
            <span className=" font-inter  font-extrabold ">
              Quinterior <br />
            </span>
            <span className="mt-[100px] font-bold ">Powered by</span>
            <br />
            <span className="font-inter bg-gradient-to-b from-[#0CC8FF] to-[#9260FF] bg-clip-text text-[1.8rem] font-extrabold leading-[112%] tracking-[-0.14063rem] text-transparent lg:text-[5rem]">
              STABLE DIFFUSION XL
            </span>
          </span>
          <span className="my-gray-box mt-[0.8rem] rounded-xl p-[0.2rem] px-[1rem] text-[0.8rem] font-semibold lg:text-[1rem] ">
            The latest advanced model in AI image generation
          </span>
        </AnimatedDiv>

        <Image
          className="user-select-none pointer-events-none absolute left-1/2 top-1/2  z-0 translate-x-[-50%] translate-y-[-50%] transform"
          src={AmbientLight2}
          alt="ambientLight2"
        ></Image>
      </div>
      {/* ///////////////////////////////////////////////////// */}
      <AnimatedDiv
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }} // Trigger once when 10% of the element is visible
        transition={{ duration: 0.5 }}
        className="relative isolate z-[2] flex h-full flex-col items-center justify-center "
      >
        <Image
          className="user-select-none pointer-events-none absolute left-1/2 top-1/2 z-0 h-full w-full  translate-x-[-50%] translate-y-[-50%] transform object-cover"
          src={OurServiceImg}
          alt="OurServiceImg"
        ></Image>
        <div className="flex h-full flex-col items-center justify-center p-[2.5rem] ">
          <Image
            className="user-select-none pointer-events-none z-10  scale-[70%]  transform lg:scale-100 "
            src={LogoLarge}
            alt="logoLarge"
            width={80}
          ></Image>
          <span className=" font-inter relative z-10 block text-[2rem] font-extrabold lg:text-[2rem]">
            Quinterior
          </span>
        </div>
      </AnimatedDiv>
      {/* ///////////////////////////////////////////////////// */}
      <div className=" relative isolate z-[1]  h-fit w-full  items-center justify-center gap-[7rem] overflow-hidden   px-[4rem] py-[5rem] lg:px-[6rem]  ">
        <Image
          src={AmbientLight3}
          alt="AmbientLight3"
          className="absolute left-[-38rem] top-[-50rem] z-[-1] "
        />
        <AnimatedDiv
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mt-[10rem]  flex h-fit  w-[90vw] flex-col items-center justify-center gap-5 xl:flex-row xl:px-[6rem]"
        >
          <div className="h-fit flex-[40%]">
            <PriceBox
              name="Design Discover"
              details={[
                'Explore diverse interior design styles',
                'Identify designs through similar images',
                'Search using image descriptions',
                'Reference inspiring prompts',
              ]}
              bgColor="#28AEB6"
              shadowColor="rgba(43,205,148,0.50)"
              nav="\find-ideas"
            ></PriceBox>
          </div>
          <div className="relative flex h-[30rem]  w-[100%] flex-col items-center  justify-between  xl:flex-row ">
            <Image
              src={FindIdeas}
              alt={'find-ideas'}
              fill
              className="rounded-xl object-contain"
            ></Image>
          </div>
        </AnimatedDiv>
        {/* ///////////////////////////////////////////////////// */}
        <AnimatedDiv
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} // Trigger once when 10% of the element is visible
          transition={{ duration: 0.5 }}
          className="relative mt-[12rem] flex  h-fit w-[90vw] flex-col items-center  justify-center gap-5 overflow-visible xl:flex-row xl:px-[6rem]"
        >
          <Image
            src={AmbientLight3}
            alt="AmbientLight3"
            className="absolute right-[-38rem] z-[-1] "
          />
          <div className="  order-3 mt-[3rem] flex h-fit w-full flex-col items-center justify-between gap-[3rem] px-0 xl:order-2 xl:flex-row xl:px-[3rem]">
            <div className="relative flex h-[30rem]  w-[100%] flex-col items-center  justify-between  xl:flex-row ">
              <Image
                src={TakePhoto}
                alt={'floor-planner'}
                className="scale-90 rounded-xl object-contain"
              ></Image>
            </div>
          </div>
          <div className="z-1 relative  order-2 flex flex-[40%] flex-col  items-center justify-center gap-[1rem] xl:gap-[1.5rem]">
            <div className="h-fit ">
              <PriceBox
                name="Floor Planner"
                details={[
                  'Create detailed floor plans',
                  'Arrange interior furnishings',
                  'Generate realistic interior renderings',
                ]}
                bgColor="#3728CF"
                shadowColor="rgba(128,128,242,0.50)"
                nav="\floor-plans"
              ></PriceBox>
            </div>
          </div>
        </AnimatedDiv>
        {/* ///////////////////////////////////////////////////// */}
        <AnimatedDiv
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} // Trigger once when 10% of the element is visible
          transition={{ duration: 0.5 }}
          className=" relative mt-[12rem]  flex h-fit  w-[90vw] flex-col items-center  justify-center   xl:flex-row "
        >
          <Image
            src={AmbientLight4}
            alt="AmbientLight4"
            className="absolute bottom-[-30rem] left-[-35rem] z-[-1]"
          />
          <div className="  flex h-fit  w-[90vw] flex-col items-center justify-center gap-5 xl:flex-row xl:px-[6rem]">
            <div className="h-fit flex-[40%]">
              <PriceBox
                name="3D Interior Models Collection"
                details={[
                  'Free for community use',
                  'Share and upload your models',
                  'Search by image and text',
                  'Integrate with Floor Planner',
                ]}
                bgColor="#B51CC2"
                shadowColor="rgba(236, 39, 182, 0.50)"
                nav="\marketplace"
              ></PriceBox>
            </div>
            <div className="relative flex h-[30rem]  w-[100%] flex-col items-center  justify-between  xl:flex-row ">
              <Image
                src={Market}
                alt={'market'}
                fill
                className="rounded-xl object-contain"
              ></Image>
            </div>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
