import Link from 'next/link';
import React from 'react'
import { FaLinkedinIn, FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

function Footer() {
	return (
		<footer className="border-t border-gray-200 text-sm text-gray-700">
			<div className="container mx-auto px-0 py-6 flex flex-wrap justify-between items-center gap-6">
				{/* Left: Logo */}
				<div className="flex items-center space-x-2">
					<div className="text-2xl font-bold text-gray-800 w-full max-w-1/4 max-w-xs-0 font-sans">
						<Link href="/" aria-label='mylogo'>MyLogo</Link>
					</div>
				</div>

				{/* Middle Links */}
				<div className="flex flex-wrap gap-6">
					<a href="#" className="hover:underline font-sans text-md">
						Terms & Conditions
					</a>
					<a href="#" className="hover:underline font-sans text-md">
						Privacy Notice
					</a>
					<a href="#" className="hover:underline font-sans text-md">
						Accessibility
					</a>
				</div>

				{/* Language */}
				<div>
					<span className="font-bold mr-1 font-sans text-md">Language</span>
					<a href="#" className="hover:underline font-sans text-md">
						English
					</a>
				</div>

				{/* Social Icons */}
				<div className="flex gap-4 text-xl text-gray-700">
					<a href="#" aria-label="LinkedIn" className="hover:text-gray-900">
						<FaLinkedinIn />
					</a>
					<a href="#" aria-label="X" className="hover:text-gray-900">
						<RxCross2 />
					</a>
					<a href="#" aria-label="Facebook" className="hover:text-gray-900">
						<FaFacebookF />
					</a>
					<a href="#" aria-label="YouTube" className="hover:text-gray-900">
						<FaYoutube />
					</a>
					<a href="#" aria-label="Instagram" className="hover:text-gray-900">
						<FaInstagram />
					</a>
				</div>
			</div>

			{/* Bottom copyright */}
			<div className="border-t border-gray-200 py-4 text-center text-sm text-gray-600 font-sans">
				© Copyright 2025 My Eway. All rights reserved.
			</div>
		</footer>
	)
}

export default Footer