'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HeaderDropdown from './HeaderDropdown';
import NavHeader from './NavHeader';
import { MdOutlineWaterDrop } from 'react-icons/md';
import SearchBar from './Search/SearchBar';
import Button from './Button/Button';

const Header = () => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const searchSubmit = (query: string) => {
		setSearchQuery(query);
		// Implement search functionality here
		console.log("Search query:", query);
	};
	return (
		<header className="w-auto relative border-b border-gray-light">
			<div className='border-b border-gray-light'>
				<div className='container mx-auto px-4'>
					{/* Top Header */}
					<div className="flex items-center bg-white w-full">
						{/* Logo */}
						<div className="text-2xl font-bold text-gray-800 w-full max-w-1/4 max-w-xs-0">
							<Link href="/" aria-label="MyLogo">MyLogo</Link>
						</div>

						<div className='flex w-full max-w-3/4 items-center'>
							{/* Search Bar */}
							<SearchBar isSearchButton onSearch={searchSubmit} placeholder='Search for all your business needs' />
							{/* Ink & Toner Button */}
							<Button children={"Ink & Toner"}
								className='ml-3 h-[36px] text-[14px]'
								isLeftIcon={true}
								icon={<MdOutlineWaterDrop className='mr-1 text-red-600 group-hover:text-white text-[18px]' />}
								variant='primary'
								type='button'
								loading={false}
								onButtonClick={() => { console.log("Ink & Toner Clicked") }}
							/>

							{/* login, help and cart button */}
							<div className="flex w-full max-w-4/10 justify-end item-center">
								<HeaderDropdown />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='container mx-auto px-4 relative'>
				{/* Navigation Bar */}
				<NavHeader />
			</div>
		</header >
	);
};

export default Header;
