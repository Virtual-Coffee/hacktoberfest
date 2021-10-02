import Link from 'next/link'

export default function ChoiceCard({ choice }) {
	return (
		<div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
			<div className="flex-1 px-6 py-8 bg-white sm:p-10 sm:pb-6">
				<div className="mt-4 flex items-baseline text-3xl leading-none font-extrabold">
					{choice.header}
				</div>
				<p className="mt-5 text-lg leading-7 text-gray-500">{choice.intro}</p>
			</div>
			<div className="flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
				<ul className="space-y-4">
					{choice.items.map((item) => (
						<li className="flex items-start" key={item}>
							<div className="flex-shrink-0">
								<svg
									className="h-6 w-6 text-green-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							</div>
							<p className="ml-3 text-base leading-6 text-gray-700">{item}</p>
						</li>
					))}
				</ul>
				<div className="rounded-md shadow">
					{choice.button.disabled ? (
						<span className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-gray-50  bg-gray-500">
							{choice.button.text}
						</span>
					) : (
						<Link href={choice.button.link}>
							<a
								className={`flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-orange-50 hover:text-white bg-orange-600 hover:bg-orange-500`}
								aria-describedby="tier-standard"
							>
								{choice.button.text}
							</a>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}
