/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './styles.css';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Show3DModal from './Show3DModal';
import { AssetItemType } from 'src/types/asset.type';

export default function SlideShow({
  assetDetailData,
}: {
  assetDetailData: AssetItemType;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="space-y-4">
      <Swiper
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {assetDetailData?.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img className="img-swiper" src={image} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSwiper={(swiper: any) => setThumbsSwiper(swiper)}
        spaceBetween={5}
        slidesPerView={8}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {assetDetailData?.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img className="img-swiper" src={image} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mb-4 flex items-center justify-center">
        <Show3DModal
          url={assetDetailData?.model?.url}
          title={assetDetailData.name}
          background={assetDetailData.background}
        />
      </div>
    </div>
  );
}
