
"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SortMenu from "@/components/SortMenu";
import { useApp } from "@/context/AppContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MdLocalShipping } from "react-icons/md";

export default function ProductsPage() {
  const {
    filteredProducts,
    categories,
    filterByCategory
  } = useApp();
  const [isOpenCategory, setOpenCategory] = useState(false)

  return (
    <>
      <div className='w-full'>
        <Header />
        <div className='container mx-auto mb-30'>
          <div className="min-h-screen pt-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-2 border border-gray-100 p-2">
              <Link className="hover:underline cursor-pointer font-sans text-sm" href='#'>All Products</Link> /
              <span className="font-sans text-sm"> </span>
            </nav>

            {/* Items count and shorting filter */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-[14px] text-color font-sans">
                Showing {filteredProducts.length} items
              </p>
              <div className="flex items-center justify-end">
                <h3 className="font-semibold text-[16px] text-color pr-3">Sort By </h3>
                <SortMenu />
              </div>
            </div>


            {/* Product Grid */}
            <main className="flex max-w-full mt-8">
              <div className="w-[18%]">
                <div className="mb-4 px-3">
                  <button className={`font-semibold text-[18px] text-color text-left py-4  border-t-1 border-gray-light w-full
                  flex items-center justify-between ${isOpenCategory ? "border-b-0" : "border-b-1"}` }
                  onClick={() => { 
                    setOpenCategory((prev) => !prev)
                  }}
                  >Category
                    {isOpenCategory ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </button>

                  {isOpenCategory && <ul className="space-y-2">
                    {categories.map((cat, index) => (
                      <li
                        key={index}
                        className="cursor-pointer hover:text-gray-600"
                        onClick={() =>{
                          console.log("--- --- ---- ----== ===",cat.name)
                           filterByCategory(cat.name)}}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>}
                  <button className={`font-semibold text-[18px] text-color text-left py-4 border-gray-light w-full
                  flex items-center justify-between border-b-1 border-t-1}`}
                    onClick={() => {
                    }}
                  >Brand
                    <ChevronDown className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 w-[82%]">
                {filteredProducts.map((product) => (
                  <Link
                    href={`/productDetails/${product.id}`}
                    key={product.id}
                    aria-label='product card'
                    className="bg-white rounded-lg hover:shadow-lg transition group p-4 border border-gray-light relative z-1 overflow-hidden"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-70 w-full object-contain mb-4"
                    />
                    <h2 className="font-semibold text-[16px] font-myfont">{product.title}</h2>
                    <p className="text-[14px] text-gray-500">{product.brand}</p>
                    <p className="text-[13px] text-gray-500">{product.sku}</p>
                    <p className="text-black font-bold mt-2">${product.price}</p>
                    <div className="flex items-center my-2 relative">
                      <span className="bg-blue-600 p-[4px] rounded-2xl transition-all easy-in-out ">
                        <MdLocalShipping className="text-white text-[13px]" />
                      </span>
                    </div>
                    <p className="absolute text-[14px] top-[90%] left-0 px-2 py-2 text-color transition-all duration-500 group-hover:translate-y-[-30px] bg-white border-t-1 border-gray-light shadow-md z-3">Sign in to view pricing and availability. Don't have an account? <a href={"#"} className="text-red-600 hover:underline">Shop as guest</a></p>
                  </Link>
                ))}
              </div>
            </main>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}
