/* This example requires Tailwind CSS v2.0+ */
import { PaperClipIcon } from '@heroicons/react/solid'
import Button from './Button'

export function CardListItem({ children }) {
	return (
		<div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
			{children}
		</div>
	)
}

export function CardListItemKey({ children }) {
	return <dt className="text-sm font-medium text-gray-500">{children}</dt>
}

export function CardListItemValue({ children }) {
	return (
		<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
			{children}
		</dd>
	)
}

export function CardList({ children }) {
	return (
		<div className="border-t border-gray-200 px-4 py-5 sm:p-0">
			<dl className="sm:divide-y sm:divide-gray-200">{children}</dl>
		</div>
	)
}

export function Card({ children }) {
	return (
		<div className="bg-white shadow overflow-hidden sm:rounded-lg">
			{children}
		</div>
	)
}

export function CardHeader({ children }) {
	return (
		<div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
			<div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
				{children}
			</div>
		</div>
	)
}

export function CardHeaderHeader({ title, description }) {
	return (
		<div className="ml-4 mt-4">
			<h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
			<p className="mt-1 text-sm text-gray-500">{description}</p>
		</div>
	)
}

export function CardHeaderActions({ children }) {
	return <div className="ml-4 mt-4 flex-shrink-0">{children}</div>
}
