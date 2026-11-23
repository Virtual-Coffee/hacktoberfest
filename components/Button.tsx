import Link from 'next/link'
import type { MouseEventHandler, ReactNode } from 'react'
import classNames from '@/util/classNames'

const defaultClassName =
	'inline-block border leading-6 font-medium rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors duration-300 ease-out disabled:pointer-events-none disabled:opacity-50'

const colors = {
	primary: 'text-on-brand bg-button hover:bg-brand-hover border-transparent',
	secondary:
		'text-button hover:text-brand-hover bg-brand-subtle border-button hover:border-brand-hover',
}

const sizes = {
	sm: 'text-sm px-3 py-1',
	md: 'text-base px-5 py-3',
	lg: 'text-lg px-7 py-5',
}

type ButtonProps = {
	href?: string
	external?: boolean
	size?: keyof typeof sizes
	color?: keyof typeof colors
	className?: string
	children?: ReactNode
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	onClick?: MouseEventHandler<HTMLElement>
}

export default function Button({
	external,
	href,
	size = 'md',
	color = 'primary',
	className: providedClassname = '',
	...props
}: ButtonProps) {
	const className = classNames(
		defaultClassName,
		sizes[size],
		colors[color],
		providedClassname
	)

	if (href) {
		if (external) {
			return <a href={href} className={className} {...props} />
		}
		return <Link href={href} className={className} {...props} />
	}

	return <button className={className} {...props} />
}
