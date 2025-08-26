import BrandCarousel from '@/components/BrandCarousel'
import CategoryGrid from '@/components/CategoryGrid'
import React from 'react'
import Image from 'next/image';
import images from '@/assets';
import PatnerGrid from '@/components/PatnerGrid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/Faq';
import Button from '@/components/Button';

export default function HomePage() {
  return (
    <>
      <Header />
      <BrandCarousel />
      <div id="ads-section" className='w-full my-4'>
        <div className='container mx-auto'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
            <a href='/products' aria-label="product banner" className='w-full h-[300px] relative block'>
              <Image alt='advertiment banner' src={images.adsImg1} className='w-full h-full object-position' fill
                quality={100} />
            </a>
            <a href='#' className='w-full h-[300px] relative block'>
              <Image alt='advertiment banner' src={images.adsImg2} className='w-full h-full object-position' fill
                quality={100} />
            </a>
          </div>
          <div className='w-full my-4 bg-red-100 py-8'>
            <h1 className='font-semibold text-[15px] text-black text-center mb-2'>Ready to shop?</h1>
            <p className='font-medium text-[17px] text-black text-center mb-2 tracking-[0.3px]'>Sign in or shop as a guest to view prices and product availability.</p>
            <div className='flex justify-center mt-4 items-center gap-4'>
              <button className='md:rounded-3xl bg-red-600 text-white md:py-2 md:px-6 border border-red-600 hover:bg-white hover:text-red-600 md:text-[14px] transition-all 
							duration-400 ease-in-out font-myfont font-medium'> Sign In</button>
              <Button children={"Shop as Guest"} className='md:rounded-3xl md:py-2 md:px-6 md:text-[14px] md:font-medium' />
            </div>
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