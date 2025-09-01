import Link from 'next/link'
import React from 'react'

function PatnerGrid() {
	return (
		<div className='w-full'>
			<div className='container mx-auto'>
				<div className="bg-white py-10 sm:py-16">
					<h2 className="text-center text-[28px] font-semibold text-gray-900 font-sans pb-6">
						<span className='text-red-800'>Staples Exclusive.</span> Meet the Brands.
					</h2>
					<div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
						<Link href='#'>
							<img
							alt="Transistor"
							src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg"
							width={158}
							height={48}
							className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						/>
						</Link>
						<a href='#'>
						<img
							alt="Reform"
							src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg"
							width={158}
							height={48}
							className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						/>
						</a>
						<a href='#'>
						<img
							alt="Tuple"
							src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg"
							width={158}
							height={48}
							className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						/>
						</a>
						<a href='#'>
						<img
							alt="SavvyCal"
							src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg"
							width={158}
							height={48}
							className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
						/>
						</a>
						<a href='#'>
						<img
							alt="Statamic"
							src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg"
							width={158}
							height={48}
							className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
						/>
						</a>
					</div>
				</div>
			</div>

		</div>
	)
}

export default PatnerGrid