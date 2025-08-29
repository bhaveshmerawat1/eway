'use client';

import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useApp } from '@/context/AppContext';
import List from './Listing/Listing';
import dummyData from '../utils/appData.json';
import Button from './Button/Button';
import DropdownWrapper from './Dropdown/DropdownWrapper';
import Link from 'next/link';

function NavHeader() {
	const { categories, fetchSubCategories, subCategoriesData } = useApp();
	const [menuOpen, setMenuOpen] = useState<string | null>(null);
	const [hoverproductName, setHoverproductName] = useState('')
	const [currentMenu, setCurrentMenu] = useState<string | null>(null);
	const [subCategoryOpen, setSubCategoryOpen] = useState<string | null>(null);

	// Toggle menu open/close
	const handleMenuClick = (section: string | null) => {
		setMenuOpen(prev =>
			prev === section ? null : section
		);
	};
	// Fetch sub-categories on hover with a delay
	const handleProductHover = (categoryName: string) => {
		setTimeout(() => {
			fetchSubCategories(categoryName)
			setSubCategoryOpen(categoryName)
			setHoverproductName(categoryName)
		}, 500);
	}

	return (
		<nav className="bg-white block relative">
			{/* Main Menu Items */}
			<List
				items={dummyData?.navItems}
				layout='list'
				listClassName='flex justify-center'
				itemClassName='sm:border-0 relative'
				renderItem={(item, index) => (
					<Button
						onButtonClick={() => {
							handleMenuClick(item.name)
							setCurrentMenu(item.name)
						}}
						aria-label={item.name}
						className={`block text-[15px] px-2 py-2 flex items-center font-bold ${menuOpen === item.name && "text-red-600"}`}
						type='button'
						variant='textOnly'
						isLeftIcon={false}
						isRightIcon={true}
						icon={<FaAngleDown className={`ml-[2px] ${menuOpen === item.name && "rotate-180"} transition duration-100 ease-in-out`} />}
						children={item.name}
					/>
				)}
			/>
			{/* Dropdown Menu */}
			<DropdownWrapper
				isOpen={menuOpen === currentMenu && menuOpen !== null}
				className="md:w-4xl sm:w-full md:py-0 left:0"
				children={
					<div className='relative'>
						{/* Close Button */}
						<Button
							onButtonClick={() => { handleMenuClick(null); }}
							aria-label='closemenu'
							className="text-[18px] font-semibold text-color sm:absolute sm:right-5 top-5 z-2"
							type='button'
							variant='textOnly'
							isLeftIcon={false}
							isRightIcon={true}
							icon={<IoClose />}
							children={null}
						/>
						{/* Dropdown Content */}
						<div className='relative flex'>
							{/* Categories List */}
							<List
								items={categories}
								layout='list'
								listClassName='md:w-2/6 sm:w-full bg-gray-c'
								itemClassName='pb-0 border-b-2 border-gray-light'
								renderItem={(cat, index) => (
									<Link href={`/category/${cat.name}`}
										className='text-[14px] p-1 flex justify-between hover:text-red-600 items-center font-semibold hover:bg-white'
										onMouseEnter={() => handleProductHover(`${cat.name}`)}
										aria-label='category'
									> {cat.name}  <span> <MdOutlineKeyboardArrowRight className='text-lg' /></span>
									</Link>
								)}
							/>
							{/* Show sub-categories only when a category is hovered */}
							<DropdownWrapper
								isOpen={subCategoryOpen === hoverproductName && subCategoryOpen !== null}
								className="md:w-4/6 sm:w-full sm:relative md:bg-white sm:z-1 sm:pt-0"
								children={
									<div className='md:px-4 sm:px-1 md:pt-5 sm:pt-2 w-full bg-white h-full'>
										<h2 className='font-sm font-semibold '>{subCategoryOpen}</h2>
										<div className='flex justify-between'>
											<List
												items={subCategoriesData?.products || []}
												layout='list'
												listClassName='my-2'
												itemClassName=''
												renderItem={(item, index) => (
													<Link href={`/productDetails/${item.id}`}
														aria-label='productDetails'
														className='text-[14px] hover:text-red-600 block mb-1'>
														{item.title}
													</Link>
												)}
											/>
										</div>
									</div>
								}
							/>
						</div>
					</div>
				}
			/>
		</nav>
	)
}

export default NavHeader