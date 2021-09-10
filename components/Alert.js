import { XCircleIcon } from '@heroicons/react/solid'

export default function Alert({ message, errors, children }) {
	return (
		<div className="rounded-md bg-red-50 p-4 mt-8">
			<div className="flex">
				<div className="flex-shrink-0">
					<XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
				</div>
				<div className="ml-3">
					{message && (
						<h3 className="text-sm font-medium text-red-800">{message}</h3>
					)}
					{errors && (
						<div className="mt-2 text-sm text-red-700">
							<ul role="list" className="list-disc pl-5 space-y-1">
								{errors.map((error, i) => (
									<li key={i}>{error}</li>
								))}
							</ul>
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	)
}
