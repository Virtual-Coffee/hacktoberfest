import Nav from './Nav'
import Head from 'next/head'
import type { ReactNode } from 'react'

type LayoutProps = {
	title?: string
	description?: string
	children: ReactNode
}

export default function Layout({ title, description, children }: LayoutProps) {
	return (
		<>
			{(title || description) && (
				<Head>
					{title && <title>{title}</title>}
					{description && <meta name="description" content={description} />}
				</Head>
			)}
			<div className="min-h-screen bg-white">
				<Nav />
				<div className="py-10">{children}</div>
			</div>
		</>
	)
}
