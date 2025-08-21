'use client'
import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/redux/productsSlice';
import { RootState } from '@/redux/store';
import SortMenu from '@/components/SortMenu';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import GridToggle from '@/components/GridToggle';
import Link from 'next/link';

function ProductsListingPage() {
  const dispatch = useDispatch();
  const { items, view, sortBy } = useSelector((state: RootState) => state.productsDetails);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  // Sorting logic (client side)
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'a-z') return a.productNumber.localeCompare(b.productNumber);
    if (sortBy === 'z-a') return b.productNumber.localeCompare(a.productNumber);
    return 0; // relevance (default)
  });

  return (
    <div className='w-full'>
      <div className='container mx-auto'>
        <div className="min-h-screen pt-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6 border border-gray-100 p-2">
            <Link className="hover:underline cursor-pointer font-sans text-sm" href='#'>Food & Cleaning</Link> /
            <span className="font-sans text-sm"> Cleaning Supplies</span>
          </nav>

          {/* Items count */}
          <p className="text-sm text-gray-600 mb-4 font-sans">
            Showing {items.length} items
          </p>

          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-64 shrink-0">
              <FilterSidebar />
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Sort & View controls */}
              <div className="flex justify-between items-center mb-4">
                <SortMenu />
                <GridToggle />
              </div>

              {/* Products list */}
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                }
              >
                {sortedItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductsListingPage