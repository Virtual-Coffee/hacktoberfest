import Nav from './Nav'
import Head from 'next/head'

export default function Layout({ title, description, children }) {
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
