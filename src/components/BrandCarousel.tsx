"use client";
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import images from '@/assets';

const slides = [
  {
    img: images.img1
  },
  {
   img: images.img2
  },
  {
   img: images.img3
  },
];

function BrandCarousel() {

  return (
    <div className="container mx-auto relative">
      {/* Left Arrow */}
      <div
        className="swiper-button-prev-custom absolute top-1/2 left-5 z-1 flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      {/* Right Arrow */}
      <div
        className="swiper-button-next-custom absolute top-1/2 right-5 z-1 flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="w-full h-[500px] sm:max-h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex items-center justify-between bg-gray-50 h-full py-3 my-3">
              <a href='/products' className='h-full w-full relative block'><Image src={slide.img} alt="BannerImage"  fill
  quality={100} className='block w-full h-auto object-position' /></a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BrandCarousel