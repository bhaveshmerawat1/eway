
'use client';

import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaExclamationCircle, FaRegComment } from 'react-icons/fa';
import { PiShoppingCartLight } from 'react-icons/pi';
import { RiUser6Line } from 'react-icons/ri';
import { useApp } from "../context/AppContext";
import Button from './Button';


const HeaderDropdown = () => {
	// login 
	const { logout, login, authUser } = useApp();
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const handleHover = (section: string | null) => {
		setOpenDropdown(section);
	};
	const [userId, setUserId] = useState('');
	const [password, setPassword] = useState('');
	const [saveUser, setSaveUser] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ userId?: string; password?: string }>({});
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showError, setShowError] = useState('')

	const validateForm = () => {
		const newErrors: { userId?: string; password?: string } = {};
		if (!userId.trim()) {
			newErrors.userId = 'Please enter a valid ID';
		}
		if (!password.trim()) {
			newErrors.password = 'Please enter a valid password';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		setOpenDropdown(null);

		try {
			const success = await login(userId, password);

			// Simulate loader delay (2s) before showing result
			setTimeout(() => {
				setLoading(false);

				if (success) {
					setShowModal(true);
					setShowError("🎉 Congratulations, login successful!");
				} else {
					setShowModal(true);
					setShowError("❌ Invalid credentials, please try again.");
				}
			}, 2000);
		} catch (error) {
			setLoading(false);
			setShowModal(true);
			setShowError("⚠️ Login failed! Something went wrong.");
		}
	};

	useEffect(() => {
		console.log("==================", authUser)
	}, []);

	return (
		<div className="flex items-center">
			{/* Sign In */}
			<div
				className="relative border-l-1 border-gray-light px-3 py-4">
				{authUser ? (

					<button className="flex-col items-center flex space-x-1"
						type="submit"
						onClick={logout}>
						<RiUser6Line className='text-gray-600 text-[16px]' />
						<span className='text-[12px] text-gray-600'>Log Out</span>
					</button>
				) : <button className="flex-col items-center flex space-x-1"
					type="submit"
					onMouseEnter={() => handleHover('signin')}
					onClick={() => {
						setOpenDropdown(prev =>
							prev === 'signin' ? null : 'signin'
						);
					}
					}>
					<RiUser6Line className='text-gray-600 text-[16px]' />
					<span className='text-[12px] text-gray-600'> {loading ? "Logging in..." : "Sign in "}</span>
				</button>}
				{openDropdown === 'signin' && (
					<div className="absolute top-full w-72 shadow-lg py-4 transition duration-100 ease-in right-0 bg-gray-c border-t-1 border-gray-light z-3">
						<div className="font-bold mb-2 flex justify-between border-b-1 border-gray-light px-4 pb-2">
							<p className='text-[16px] font-semibold'>Sign in</p>
							<button type='submit' className='text-[12px] leading-[12px] p-1' onClick={() => handleHover(null)}><span>Close</span></button>
						</div>
						<form onSubmit={handleSubmit} className="px-4 py-1">
							{/* User ID */}
							<div className='mb-2'>
								<label className="block mb-1 text-[12px] text-color ">User ID</label>
								<input
									type="text"
									value={userId}
									onChange={(e) => {
										setUserId(e.target.value);
										if (errors.userId && e.target.value.trim()) {
											setErrors((prev) => ({ ...prev, userId: undefined }));
										}
									}}
									className={`w-full border rounded p-2 text-[12px] focus:outline-none h-[36px] ${errors.userId ? 'border-red-500 bg-red-200' : 'border-gray-c bg-white '
										}`}
								/>
								{errors.userId && (
									<p className="flex items-center text-red-600 text-xs mt-1">
										<FaExclamationCircle className="mr-1" />
										{errors.userId}
									</p>
								)}
							</div>

							{/* Password */}
							<div className='mb-2'>
								<label className="block mb-1 text-[12px] text-color">Password</label>
								<div className="relative">
									<input
										type={showPassword ? 'text' : 'password'}
										value={password}
										onChange={(e) => {
											setPassword(e.target.value)
											if (errors.password && e.target.value.trim()) {
												setErrors((prev) => ({ ...prev, password: undefined }));
											}
										}}
										className={`w-full border rounded p-2 text-[12px] focus:outline-none pr-10 h-[36px] ${errors.password ? 'border-red-500 bg-red-200' : 'border-gray-c bg-white'
											}`}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-2 top-2 text-gray-500 cursor-pointer text-lg"
									>
										{showPassword ? <FaEyeSlash /> : <FaEye />}
									</button>
								</div>
								{errors.password && (
									<p className="flex items-center text-red-600 text-xs mt-1">
										<FaExclamationCircle className="mr-1" />
										{errors.password}
									</p>
								)}
							</div>

							{/* Save User ID */}
							<div className="flex items-center mb-2">
								<input
									id="saveUser"
									type="checkbox"
									checked={saveUser}
									onChange={(e) => setSaveUser(e.target.checked)}
									className="mr-2 h-[16px] w-[16px] accent-red-400"
								/>
								<label htmlFor="saveUser" className="text-[13px] font-semibold text-gray-666 ">
									Save User ID
								</label>
							</div>

							{/* Submit */}
							<button
								type="submit"
								className="w-full text-[13px] border font-medium bg-red-600 text-white rounded-full py-2 my-1 hover:bg-white transition hover:border hover:border-red-600 hover:text-red-600"
							>
								Sign in
							</button>

							{/* Forgot Links */}
							<p className="text-xs mt-2">
								Forgot{' '}
								<span className="text-red-600 cursor-pointer underline">
									User ID
								</span>{' '}
								or{' '}
								<span className="text-red-600 cursor-pointer underline">
									Password
								</span>
								?
							</p>
						</form>
					</div>
				)}
			</div>

			{/* Help */}
			<div
				className="relative border-l-1 border-gray-light px-3 py-4"
				onMouseEnter={() => handleHover('help')}
				onMouseLeave={() => handleHover(null)}
			>
				<button className="flex-colspace-x-1 hover:text-red-600 px-2 flex flex-col items-center text-[12px]">
					<FaRegComment className='text-gray-600 text-[16px]' />
					<span className='text-xs text-gray-600' >Help</span>
				</button>
				{openDropdown === 'help' && (
					<div className="absolute top-full w-60 shadow-lg transition duration-100 ease-in right-0 bg-gray-c border-t-1 border-gray-light z-2">
						<ul className="space-y-1 fonat-sans">
							<li className="border-b-1 border-gray-c hover:bg-white cursor-pointer group">
								<a href='#' className='text-sm font-semibold p-2 group-hover:text-red-600'>Contact Us</a>
							</li>
							<li className="border-b-1 border-gray-c hover:bg-white cursor-pointer group">
								<a href='#' className='text-sm font-semibold p-2 group-hover:text-red-600'>Help Center</a>
							</li>
							<li className="border-b-1 border-gray-c hover:bg-white cursor-pointer group">
								<a href='#' className='text-sm font-semibold p-2 group-hover:text-red-600'>Recall Information </a></li>
						</ul>
					</div>
				)}
			</div>

			{/* Cart */}
			<div
				className="relative border-l-1 border-gray-light bg-red-700 px-3 py-4"
				onMouseEnter={() => handleHover('cart')}
				onMouseLeave={() => handleHover(null)}
			>
				<button className="space-x-1 hover:text-red-600 px-2 flex flex-col items-center text-[12px]">
					<PiShoppingCartLight className='text-white text-[16px]' />
					<span className='text-white' >Cart</span>
				</button>
				{openDropdown === 'cart' && (
					<div className="absolute top-full w-70 shadow-lg transition duration-100 ease-in right-0 bg-gray-c border-t-3 border-red-600 p-8 z-2">
						<p className="text-sm">To use this feature, please sign in or become a customer</p>
					</div>
				)}
			</div>

			{loading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<div className="w-12 h-12 border-4 border-white border-t-red-600 rounded-full animate-spin"></div>
				</div>
			)}

			{/* Success Modal */}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center">
						<h3 className="text-xl font-bold text-color">{showError}</h3>
						<Button children={"ok"} className='my-3' onClick={() => setShowModal(false)} />
					</div>
				</div>
			)}
		</div>
	);
};

export default HeaderDropdown;
