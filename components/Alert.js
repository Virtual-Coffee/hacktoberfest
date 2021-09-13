import {
	XCircleIcon,
	ExclamationIcon,
	CheckCircleIcon,
	InformationCircleIcon,
} from '@heroicons/react/solid'
import classNames from '../util/classNames'

const alertTypes = {
	error: {
		bodyBg: 'bg-red-50',
		Icon: XCircleIcon,
		iconColor: 'text-red-400',
		titleColor: 'text-red-800',
		bodyColor: 'text-red-700',
	},
	warning: {
		bodyBg: 'bg-yellow-50',
		Icon: ExclamationIcon,
		iconColor: 'text-yellow-400',
		titleColor: 'text-yellow-800',
		bodyColor: 'text-yellow-700',
	},
	success: {
		bodyBg: 'bg-green-50',
		Icon: CheckCircleIcon,
		iconColor: 'text-green-400',
		titleColor: 'text-green-800',
		bodyColor: 'text-green-700',
	},
	info: {
		bodyBg: 'bg-blue-50',
		Icon: InformationCircleIcon,
		iconColor: 'text-blue-400',
		titleColor: 'text-blue-800',
		bodyColor: 'text-blue-700',
	},
}

export default function Alert({ title, alertType = 'info', children }) {
	const typeStyles = alertTypes[alertType]
	return (
		<div className={classNames('rounded-md p-4 mt-8', typeStyles.bodyBg)}>
			<div className="flex">
				<div className="flex-shrink-0">
					<typeStyles.Icon
						className={classNames('h-5 w-5', typeStyles.iconColor)}
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3">
					{title && (
						<h3
							className={classNames(
								'text-sm font-medium',
								typeStyles.titleColor
							)}
						>
							{title}
						</h3>
					)}

					<div
						className={classNames(
							'mt-2 space-y-2 text-sm',
							typeStyles.bodyColor
						)}
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}

export function InfoAlert({ title, children }) {
	return (
		<Alert title={title} alertType="info">
			{children}
		</Alert>
	)
}

export function SuccessAlert({ title, children }) {
	return (
		<Alert title={title} alertType="success">
			{children}
		</Alert>
	)
}

export function WarningAlert({ title, children }) {
	return (
		<Alert title={title} alertType="warning">
			{children}
		</Alert>
	)
}

export function ErrorAlert({ title, errors, children }) {
	return (
		<Alert title={title} alertType="error">
			<>
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
			</>
		</Alert>
	)
}
