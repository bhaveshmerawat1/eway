"use client"
import { useProducts } from '@/context/ProductContext';
import React from 'react'
import Button from "../Button/Button";

function AllProductList() {
  const { products, addItemToCart } = useProducts();
  const handleAddToCart = (product: any) => {
    addItemToCart(product)
  }

  return (
    <div className="bg-[#f7f7fb]">
      <div className="px-4 py-16 sm:px-6 sm:py-24 w-full lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">All Products</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative px-3 bg-white rounded-md py-3 border-gray-600">
              <div className='w-full h-80'>
                <img
                  alt={product.name}
                  src={product.imageUrl}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
              </div>
              <div className="mt-4">
                <a href={"#"} className="text-sm text-gray-700">
                  {product.name}
                </a>
                <p className="py-1 text-sm text-gray-500">{product.description}</p>
                <p className="text-md font-medium text-gray-900">{"$ " + product.price}</p>
              </div>
              <div className="flex items-center py-3 relative">
                <Button
                  children={"Add to cart"}
                  onClick={() => handleAddToCart(product)}
                  type="button"
                  variant="primary"
                  arialabel="add to cart"
                  isTestID={"add-to-cart-btnID"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllProductList