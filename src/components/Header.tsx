'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import "../app/globals.css";
import HeaderDropdown from './HeaderDropdown';
import NavHeader from './NavHeader';
import { MdOutlineWaterDrop } from 'react-icons/md';

const Header = () => {
	return (
		<header className="w-auto relative border-b-1 border-gray-light">
			<div className='border-b-1 border-gray-light'>
				<div className='container mx-auto px-4'>
					{/* Top Header */}
					<div className="flex items-center bg-white w-full">
						{/* Logo */}
						<div className="text-2xl font-bold text-gray-800 w-full max-w-1/4 max-w-xs-0 font-myfont">
							<Link href="/" aria-label='mylogo' className='font-myfont'>MyLogo</Link>
						</div>

						<div className='flex w-full max-w-3/4 items-center'>
							<div className="flex border border-gray-c rounded overflow-hidden w-full max-w-5/10 h-[36px]">
								{/* Search Input */}
								<input
									type="search"
									placeholder="Search for all your business needs"
									aria-label='Search for all your business needs'
									className="flex-grow px-4 py-2 text-gray-800 outline-none 
									focus:border-[0.5] focus:border-gray-c focus:border-r-0 text-[13px] group transition-all duration-400 ease-in-out"
									maxLength={200}
								/>

								{/* Search Button */}
								<button className="bg-gray-800 px-2 flex items-center justify-center"
									type='button'
								>
									{/* Search Icon (Heroicons) */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="white"
										className="w-10 h-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
										/>
									</svg>
								</button>
							</div>
							<button className='flex border border-gray-c rounded items-center justify-center px-3 text-gray-800 text-[13px] 
							mx-3 w-full max-w-max h-[36] hover:bg-gray-800 hover:text-white group transition-all 
							duration-400 ease-in-out font-myfont'>
								<MdOutlineWaterDrop className='mr-1 group-hover:text-white transition-all duration-400 ease-in-out' />
								Ink & Toner
							</button>

							{/* Buttons */}
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
