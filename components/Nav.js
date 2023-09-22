import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from './Button'
import classNames from '../util/classNames'
import Container from './Container'
import { useRouter } from 'next/router'

const userNavigation = [
	{ name: 'Dashboard', props: { href: '/dashboard' } },
	{
		name: 'Sign out',
		props: {
			href: '/api/auth/signout',
			onClick: (e) => {
				e.preventDefault()
				signOut()
			},
		},
	},
]

const navigation = [
	{ name: 'VC Hacktoberfest', href: '/' },
	{ name: 'FAQ', href: '/#questions' },
	{ name: 'Virtual Coffee', href: 'https://virtualcoffee.io' },
	{ name: 'Code of Conduct', href: 'https://virtualcoffee.io/code-of-conduct' },
	{ name: 'Dashboard', href: '/dashboard', authOnly: true },
]

export default function Nav() {
	const { data: session, status: sessionStatus } = useSession()
	const { pathname } = useRouter()

	return (
		<>
			<noscript>
				<style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
			</noscript>
			<Disclosure
				as="nav"
				className="bg-white border-b border-gray-200 sticky top-0 z-10"
			>
				{({ open }) => (
					<>
						<Container>
							<div className="flex justify-between h-16">
								<div className="flex">
									<div className="flex-shrink-0 flex items-center">
										<img
											className="block lg:hidden h-8 w-auto"
											src="https://virtualcoffee.io/assets/images/virtual-coffee-mug.svg"
											alt="Virtual Coffee"
										/>
										<img
											className="hidden lg:block h-8 w-auto"
											src="https://virtualcoffee.io/assets/images/virtual-coffee-full.svg"
											alt="Virtual Coffee"
										/>
									</div>
									<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
										{navigation.map(({ name, authOnly, href, ...rest }) => {
											if (authOnly && sessionStatus !== 'authenticated') {
												return null
											}

											return (
												<Link
													href={href}
													key={name}
													className={classNames(
														href === pathname
															? 'border-indigo-500 text-gray-900'
															: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
														'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
													)}
													aria-current={href === pathname ? 'page' : undefined}
													{...rest}
												>
													{name}
												</Link>
											)
										})}
									</div>
								</div>
								<div className="hidden sm:ml-6 sm:flex sm:items-center">
									{/* Profile dropdown */}
									<div className="ml-3 relative">
										{sessionStatus === 'loading' && <div>Loading</div>}
										{sessionStatus === 'unauthenticated' && (
											<Button size="sm" onClick={() => signIn('github')}>
												Sign in with GitHub
											</Button>
										)}
										{sessionStatus === 'authenticated' && (
											<Menu as="div">
												<div>
													<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
														<span className="sr-only">Open user menu</span>
														<img
															className="h-8 w-8 rounded-full"
															src={session.user.image}
															alt=""
														/>
													</Menu.Button>
												</div>
												<Transition
													as={Fragment}
													enter="transition ease-out duration-200"
													enterFrom="transform opacity-0 scale-95"
													enterTo="transform opacity-100 scale-100"
													leave="transition ease-in duration-75"
													leaveFrom="transform opacity-100 scale-100"
													leaveTo="transform opacity-0 scale-95"
												>
													<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
														{userNavigation.map(
															({ name, props: { href, ...rest } }) => (
																<Menu.Item key={name}>
																	{({ active }) => (
																		<Link
																			href={href}
																			className={classNames(
																				active ? 'bg-gray-100' : '',
																				'block px-4 py-2 text-sm text-gray-700'
																			)}
																			{...rest}
																		>
																			{name}
																		</Link>
																	)}
																</Menu.Item>
															)
														)}
													</Menu.Items>
												</Transition>
											</Menu>
										)}
									</div>
								</div>
								<div className="-mr-2 flex items-center sm:hidden">
									{/* Mobile menu button */}
									<Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										<span className="sr-only">Open main menu</span>
										{open ? (
											<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
										) : (
											<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
										)}
									</Disclosure.Button>
								</div>
							</div>
						</Container>

						<Disclosure.Panel className="sm:hidden">
							<div className="pt-2 pb-3 space-y-1">
								{navigation.map(({ name, current, href, ...rest }) => (
									<Link
										href={href}
										key={name}
										className={classNames(
											current
												? 'bg-indigo-50 border-indigo-500 text-indigo-700'
												: 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
											'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
										)}
										aria-current={current ? 'page' : undefined}
										{...rest}
									>
										{name}
									</Link>
								))}
							</div>
							{sessionStatus === 'loading' && <div>Loading</div>}
							{sessionStatus === 'unauthenticated' && (
								<div className="px-3 py-4 border-t border-gray-200">
									<Button size="sm" onClick={() => signIn('github')}>
										Sign in with GitHub
									</Button>
								</div>
							)}
							{sessionStatus === 'authenticated' && (
								<div className="pt-4 pb-3 border-t border-gray-200">
									<div className="flex items-center px-4">
										<div className="flex-shrink-0">
											<img
												className="h-10 w-10 rounded-full"
												src={session.user.image}
												alt=""
											/>
										</div>
										<div className="ml-3">
											<div className="text-base font-medium text-gray-800">
												{session.user.name}
											</div>
										</div>
									</div>
									<div className="mt-3 space-y-1">
										{userNavigation.map(
											({ name, props: { href, ...rest } }) => (
												<Link
													href={href}
													key={name}
													className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
													{...rest}
												>
													{name}
												</Link>
											)
										)}
									</div>
								</div>
							)}
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</>
	)
}
