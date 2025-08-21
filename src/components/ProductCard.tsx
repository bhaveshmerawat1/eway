'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  brand: string;
  productNumber: string;
  image: string;
  shopCanadian: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={"#"} aria-label='product card' className="border border-gray-c rounded-md bg-white p-3 hover:shadow-md transition group">
      <div className="relative w-full h-36 flex justify-center items-center bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          width={140}
          height={300}
          className="object-contain"
        />
      </div>

      <div className="mt-3">
        {product.shopCanadian && (
          <span className="text-xs text-red-500 border border-red-500 px-2 py-0.5 rounded-full">
            Shop Canadian
          </span>
        )}

        <h2 className="text-md font-medium my-1 font-sans">{product.name}</h2>
        <p className="text-sm text-gray-600 font-sans mb-1">{product.brand}</p>
        <p className="text-xs text-gray-600 font-sans">{product.productNumber}</p>

        <p className="text-sm text-gray-800 mt-2 pt-2 font-sans transition-all duration-500 group-hover:translate-y-[-20px] bg-white border-t-1 border-gray-c">
          Login for pricing and availability information.
        </p>
      </div>
    </Link>
  );
}
