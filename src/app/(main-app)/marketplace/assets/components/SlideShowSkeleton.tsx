'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './styles.css';

import { Skeleton } from '@nextui-org/react';

export default function SlideShowSkeleton() {
  return (
    <div className="container_custom">
      <div className="mb-8 mt-10 flex w-full">
        <div className="w-full md:w-[65%]">
          <Swiper className="mySwiper2 mb-2">
            <SwiperSlide>
              <Skeleton className="h-full w-full">
                <div className="h-full w-full bg-default-200"></div>
              </Skeleton>
            </SwiperSlide>
          </Swiper>
          <Swiper
            // onSwiper={setThumbsSwiper}
            spaceBetween={5}
            slidesPerView={8}
            className="mySwiper"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SwiperSlide key={i}>
                <Skeleton>
                  <div className="h-[60px] w-[90px] bg-default-200"></div>
                </Skeleton>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mb-4 ml-6 hidden w-[35%]  md:block">
          <Skeleton className="h-full w-full rounded-md">
            <div className="h-full w-full bg-default-200"></div>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
