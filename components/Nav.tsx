import Link from 'next/link'
import { signInWithGitHub, signOut, useSessionStatus } from '@/lib/auth-client'
import type { SessionStatus } from '@/lib/auth-client'
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from './Button'
import classNames from '@/util/classNames'
import Container from './Container'
import { useRouter } from 'next/router'
import type { MouseEvent } from 'react'

type NavItem = {
	name: string
	href: string
	authOnly?: boolean
	adminOnly?: boolean
	/** Keep the item active on nested routes, e.g. /admin/contributors. */
	matchPrefix?: boolean
	current?: boolean
}

type UserNavItem = {
	name: string
	props: {
		href: string
		onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
	}
}

const userNavigation: UserNavItem[] = [
	{ name: 'Dashboard', props: { href: '/dashboard' } },
	{
		name: 'Sign out',
		props: {
			href: '/',
			onClick: (e) => {
				e.preventDefault()
				signOut()
			},
		},
	},
]

const navigation: NavItem[] = [
	{ name: 'VC Hacktoberfest', href: '/' },
	{ name: 'FAQ', href: '/#questions' },
	{ name: 'Virtual Coffee', href: 'https://virtualcoffee.io' },
	{ name: 'Code of Conduct', href: 'https://virtualcoffee.io/code-of-conduct' },
	{ name: 'Dashboard', href: '/dashboard', authOnly: true },
	{ name: 'Admin', href: '/admin', adminOnly: true, matchPrefix: true },
]

const isVisible = (
	item: NavItem,
	sessionStatus: SessionStatus,
	role?: string | null
) => {
	if (item.adminOnly) {
		return sessionStatus === 'authenticated' && role === 'admin'
	}
	if (item.authOnly) {
		return sessionStatus === 'authenticated'
	}
	return true
}

const isCurrent = (item: NavItem, pathname: string) =>
	item.matchPrefix
		? pathname === item.href || pathname.startsWith(`${item.href}/`)
		: pathname === item.href

export default function Nav() {
	const { data: session, status: sessionStatus } = useSessionStatus()
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
									<div className="shrink-0 flex items-center">
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
										{navigation.map((item) => {
											if (!isVisible(item, sessionStatus, session?.user.role)) {
												return null
											}

											const {
												name,
												href,
												current: _current,
												authOnly: _authOnly,
												adminOnly: _adminOnly,
												matchPrefix: _matchPrefix,
												...rest
											} = item
											const current = isCurrent(item, pathname)

											return (
												<Link
													href={href}
													key={name}
													className={classNames(
														current
															? 'border-indigo-500 text-gray-900'
															: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
														'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
													)}
													aria-current={current ? 'page' : undefined}
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
											<Button size="sm" onClick={() => signInWithGitHub()}>
												Sign in with GitHub
											</Button>
										)}
										{sessionStatus === 'authenticated' && (
											<Menu as="div">
												<div>
													<MenuButton className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
														<span className="sr-only">Open user menu</span>
														<img
															className="h-8 w-8 rounded-full"
															src={session?.user?.image ?? undefined}
															alt=""
														/>
													</MenuButton>
												</div>
												<MenuItems
													transition
													className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black/5 focus:outline-hidden transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 data-[leave]:duration-75 data-[leave]:ease-in"
												>
													{userNavigation.map(
														({ name, props: { href, ...rest } }) => (
															<MenuItem key={name}>
																{({ focus }) => (
																	<Link
																		href={href}
																		className={classNames(
																			focus ? 'bg-gray-100' : '',
																			'block px-4 py-2 text-sm text-gray-700'
																		)}
																		{...rest}
																	>
																		{name}
																	</Link>
																)}
															</MenuItem>
														)
													)}
												</MenuItems>
											</Menu>
										)}
									</div>
								</div>
								<div className="-mr-2 flex items-center sm:hidden">
									{/* Mobile menu button */}
									<DisclosureButton className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										<span className="sr-only">Open main menu</span>
										{open ? (
											<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
										) : (
											<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
										)}
									</DisclosureButton>
								</div>
							</div>
						</Container>

						<DisclosurePanel className="sm:hidden">
							<div className="pt-2 pb-3 space-y-1">
								{navigation.map((item) => {
									if (!isVisible(item, sessionStatus, session?.user.role)) {
										return null
									}

									const {
										name,
										href,
										current: _current,
										authOnly: _authOnly,
										adminOnly: _adminOnly,
										matchPrefix: _matchPrefix,
										...rest
									} = item
									const current = isCurrent(item, pathname)

									return (
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
									)
								})}
							</div>
							{sessionStatus === 'loading' && <div>Loading</div>}
							{sessionStatus === 'unauthenticated' && (
								<div className="px-3 py-4 border-t border-gray-200">
									<Button size="sm" onClick={() => signInWithGitHub()}>
										Sign in with GitHub
									</Button>
								</div>
							)}
							{sessionStatus === 'authenticated' && (
								<div className="pt-4 pb-3 border-t border-gray-200">
									<div className="flex items-center px-4">
										<div className="shrink-0">
											<img
												className="h-10 w-10 rounded-full"
												src={session?.user?.image ?? undefined}
												alt=""
											/>
										</div>
										<div className="ml-3">
											<div className="text-base font-medium text-gray-800">
												{session?.user?.name}
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
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
		</>
	)
}
