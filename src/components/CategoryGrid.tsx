"use client";

import Link from "next/link";
import { useApp } from '@/context/AppContext';

export default function CategoryGrid() {
  const { products} = useApp();
  console.log("======================", products)
  return (
    <div className='w-full'>
      <div className="container mx-auto relative">
        <h2 className='text-center font-medium font-sans mt-[40px] mb-[30px] text-[28px]'>Explore our Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((items,index) => (
            <Link
              href={`/products`}
              key={index}
              className="flex flex-col items-center text-center p-4 mb-3 shadow-sm hover:shadow-lg transition"
            >
              <img
                src={items.thumbnail}
                alt={items.title}
                width={300}
                height={300}
                className="object-contain"
              />
              <span className="mt-2 text-red-500 text-md font-normal font-sans">{items.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
