import BrandCarousel from '@/components/BrandCarousel'
import CategoryGrid from '@/components/CategoryGrid'
import React from 'react'
import Image from 'next/image';
import images from '@/assets';
import PatnerGrid from '@/components/PatnerGrid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/Faq';

export default function HomePage() {
  return (
    <>
    <Header />
      <BrandCarousel />
      <div id="ads-section" className='w-full my-4'>
        <div className='container mx-auto'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
            <a href='/products' className='w-full h-[300px] relative block'>
              <Image alt='advertiment banner' src={images.adsImg1} className='w-full h-full object-position' fill
                quality={100} />
            </a>
            <a href='#' className='w-full h-[300px] relative block'>
              <Image alt='advertiment banner' src={images.adsImg2} className='w-full h-full object-position' fill
                quality={100} />
            </a>
          </div>
        </div>
      </div>
      <FAQ />
      <CategoryGrid />
      <PatnerGrid />
      <Footer />
    </>
  )
}
