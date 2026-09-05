import type { ReactNode } from 'react'

export default function Container({ children }: { children: ReactNode }) {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
	)
}
