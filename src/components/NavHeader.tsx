'use client';

import Link from 'next/link';
import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useApp } from '@/context/AppContext';


function NavHeader() {
	const { categories, fetchSubCategories, subCategoriesData } = useApp();
	const [menuOpen, setMenuOpen] = useState<string | null>(null);
	const [hoverproductName, setHoverproductName] = useState('')
	const handleMenuClick = (section: string | null) => {
		setMenuOpen(prev =>
			prev === section ? null : section
		);
	};

	const [subCategoryOpen, setSubCategoryOpen] = useState<string | null>(null);
	const handleProductHover = (categoryName:string) => {
		setTimeout(() => {
			fetchSubCategories(categoryName)
			setSubCategoryOpen(categoryName)
			setHoverproductName(categoryName)
		}, 500);
	}

	return (
		<nav className="bg-white block relative">
			<ul className="flex justify-center">
				<li className={`p-3`}>
					<button
						onClick={() => {
							setMenuOpen(prev =>
								prev === 'products' ? null : 'products'
							);
						}}
						aria-label='Products'
						className={`block text-[15px] relative text-color px-2 flex items-center font-bold ${menuOpen === "products" && "text-red-600"}`}
					>
						Products
						<FaAngleDown className={`ml-[2px] ${menuOpen === "products" && "rotate-180"} transition duration-100 ease-in-out`} />
					</button>
				</li>
				<li className={`relative p-3`}>
					<button
						onClick={() => { handleMenuClick('service&solution') }}
						aria-label='service&solution'
						className={`${menuOpen === "service&solution" && "text-red-600"} text-[15px] font-bold text-color px-2 flex items-center`}
					>
						Service & Solution
						<FaAngleDown className={`ml-[2px] ${menuOpen === "service&solution" && "rotate-180"} transition duration-100 ease-in-out`} />
					</button>
				</li>
				<li className={`relative p-3`}>
					<button
						onClick={() => { handleMenuClick('brands') }}
						aria-label='Brands'
						className={`${menuOpen === "brands" && "text-red-600"} text-[15px] font-bold text-color px-2 flex items-center`}
					>
						Brands
						<FaAngleDown className={`ml-[2px] ${menuOpen === "brands" && "rotate-180"} transition duration-100 ease-in-out`} />
					</button>
				</li>
				<li className={`relative p-3`}>
					<button
						onClick={() => { handleMenuClick('Deals') }}
						aria-label='Deals'
						className={`${menuOpen === "Deals" && "text-red-600"} text-[15px] font-bold text-color  px-2 flex items-center`}
					>
						Deals
						<FaAngleDown className={`ml-[2px] ${menuOpen === "Deals" && "rotate-180"} transition duration-100 ease-in-out`} />
					</button>
				</li>
				<li className={`relative p-3`}>
					<button
						aria-label='Publications'
						onClick={() => { handleMenuClick('Publications') }}
						className={`${menuOpen === "Publications" && "text-red-600"} text-[15px] font-bold text-color px-2 flex items-center`}
					>
						Publications
						<FaAngleDown className={`ml-[2px] ${menuOpen === "Publications" && "rotate-180"} transition duration-100 ease-in-out`} />
					</button>
				</li>
				<li className={`relative p-3`}>
					<Link href="/contact" aria-label='contact' className="text-[14px] font-semibold text-color flex items-center ">Become A Customer</Link>
				</li>
			</ul>
			{menuOpen === "products" && (
				<div className='absolute top-full md:left-60 mt-1 md:w-4xl sm:w-full rounded transition duration-100 ease-in bg-white z-2 shadow-lg'>
					<button
						onClick={() => { handleMenuClick(null) }}
						aria-label='closemenu'
						className="text-[18px] font-semibold text-color absolute right-5 top-5 z-2"
					>
						<IoClose />
					</button>
					<div className='relative flex'>
						<ul className='md:w-2/6 sm:w-full bg-gray-c'>
							{categories.map((cat,index) => (
								<li key={index} className='pb-0 border-b-2 border-gray-light'>
									<a className='text-[14px] text-color p-1 flex justify-between hover:text-red-600 items-center font-semibold hover:bg-white'
										onMouseEnter={() => handleProductHover(`${cat.name}`)}
										aria-label='category'
									> {cat.name}  <span> <MdOutlineKeyboardArrowRight className='text-lg' /></span>
									</a>
								</li>
							))}
						</ul>
						<div className='md:w-4/6 sm:w-full relative bg-white'>
							{subCategoryOpen === hoverproductName && (
								<div className='md:px-4 sm:px-1 md:pt-5 sm:pt-2'>
									<h2 className='font-sm font-semibold '>{subCategoryOpen}</h2>
									<div className='flex justify-between'>
										<ul className='my-2'>
											{subCategoriesData?.products.map((item,index) => ((
												<li key={index} className=''>
													<a href={`/productDetails/${item.id}`} 
													aria-label='productDetails'
													className='text-[14px] text-color hover:text-red-600'>
														{item.title}
													</a>
												</li>
											)))}
										</ul>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}

export default NavHeader