'use client';

import { useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { PiShoppingCartLight } from 'react-icons/pi';
import { RiUser6Line } from 'react-icons/ri';
import { useApp } from "../context/AppContext";
import Button from './Button/Button';
import DropdownWrapper from './Dropdown/DropdownWrapper';
import SignInForm from './LoginSignUp/SignInForm';
import List from './Listing/Listing';
import Link from 'next/link';
import useToggle from '@/hooks/useToggle';

const HeaderDropdown = () => {
	const { logout, login, authUser } = useApp();
	const [formState, setFormState] = useState({
		userId: "",
		password: "",
		saveUser: false,
		showPassword: false,
	});
	const [errors, setErrors] = useState<{ userId?: string; password?: string }>({});
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showError, setShowError] = useState('');
	// Custom hook for dropdown open and close 
	const { toggleDropdown, closeDropdown, isOpen } = useToggle<string | null>(null);
	

	// Form validation
	const validateForm = () => {
		const newErrors: { userId?: string; password?: string } = {};
		if (!formState.userId.trim()) {
			newErrors.userId = "Please enter a valid ID";
		}
		if (!formState.password.trim()) {
			newErrors.password = "Please enter a valid password";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		setLoading(true);
		try {
			const success = await login(formState.userId, formState.password);
			setShowError(success ? "🎉 Login successful!" : "❌ Invalid credentials.");
			toggleDropdown(null)

		} catch {
			setShowError("⚠️ Something went wrong.");
			toggleDropdown(null)
		} finally {
			setLoading(false);
			setShowModal(true);
			toggleDropdown(null)
		}
	};

	return (
		<div className="flex items-center">
			{/* Sign In */}
			<div className="relative border-l-1 border-gray-light">
				{authUser ? (
					// Logout Button
					<Button
						children={"Log Out"}
						variant='flexColBtn'
						className='text-[12px] space-x-1 sm:py-3'
						isLeftIcon
						arialabel='logout'
						loading={loading}
						icon={<RiUser6Line className='text-[16px]' />}
						onButtonClick={logout}
					/>
				) :
					// Signin Button
					<Button
						children={"Sign In"}
						variant='flexColBtn'
						className='text-[12px] space-x-1 sm:py-3'
						isLeftIcon
						icon={<RiUser6Line className='text-[16px]' />}
						arialabel='signin'
						loading={loading}
						onMouseEnter={() => toggleDropdown("signin")}
						onButtonClick={() => toggleDropdown("signin")}
					/>
				}
				{/*Signin Dropdown */}
				<DropdownWrapper
					isOpen={isOpen("signin")}
					className="w-72 sm:right-0"
					children={
						<SignInForm
							onSubmit={handleSubmit}
							loading={loading}
							errors={errors}
							setErrors={setErrors}
							onClickCloseBtn={closeDropdown}
							formState={formState}
							setFormState={setFormState}
						/>
					}
				/>
			</div>

			{/* Help */}
			<div className="relative border-l-1 border-gray-light">
				<Button
					className="flex-colspace-x-1 hover:text-red-600 px-2 py-3 flex flex-col items-center text-[12px]"
					variant="flexColBtn"
					data-testid='helpBtnMobile'
					arialabel='help'
					type='button'
					onMouseEnter={() => toggleDropdown('help')}
					onButtonClick={() => toggleDropdown('help')}
					children={"Help"}
					icon={<FaRegComment className='text-[16px]' />}
				/>

				<DropdownWrapper
					isOpen={isOpen('help')}
					className="w-72 sm:py-1 sm:right-0"
					children={
						<List
							items={["Contact Us", "Help Center", "Recall Information"]}
							layout='list'
							renderItem={(item, index) => (
								<Link href={item} aria-label={item} className='text-sm font-semibold py-1 px-1 block hover:text-red-600 hover:bg-white group'>{item}</Link>
							)}
						/>
					}
				/>
			</div>

			{/* Cart */}
			<div className="relative border-l-1 border-gray-light bg-red-700">
				<Button
					className="flex-col space-x-1 text-white px-2 py-3 items-center text-[12px]"
					variant="flexColBtn"
					data-testid='CartBtnMobile'
					arialabel='Cart'
					type='button'
					onMouseEnter={() => toggleDropdown('cart')}
					onButtonClick={() => toggleDropdown(null)}
					children={"Cart"}
					icon={<PiShoppingCartLight className='text-[16px]' />}
				/>
				<DropdownWrapper
					isOpen={isOpen('cart')}
					className="w-70 sm:border-t-3 md:border-red-600 md:p-8 sm:right-0"
					children={
						<p className="text-sm">To use this feature, please sign in or become a customer</p>
					}
				/>
			</div>

			{/* Success Modal */}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center">
						<h3 className="text-xl font-bold text-color">{showError}</h3>
						<Button children={"ok"} aria-label="modal close" className='my-3' onButtonClick={() => setShowModal(false)} />
					</div>
				</div>
			)}
		</div>
	);
};

export default HeaderDropdown;
