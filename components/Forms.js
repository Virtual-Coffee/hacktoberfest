import { Disclosure, Transition } from '@headlessui/react'
import { useCallback, useEffect, useReducer } from 'react'
import * as formData from '../data/forms'
import Alert, { ErrorAlert } from './Alert'
import Button from './Button'
import Layout from './Layout'

const labelClass = 'block text-sm font-medium text-gray-700'
const helpClass = 'text-sm leading-6 text-gray-500'

export function FormLayout({ title, description, children }) {
	return (
		<Layout title={title} description={description}>
			<div className="relative max-w-3xl mx-auto px-4">
				<div className="mt-12">{children}</div>
			</div>
		</Layout>
	)
}

export function FieldSet({ legend, legendDesc, children, ...rest }) {
	return (
		<fieldset className="space-y-8 py-8" {...rest}>
			{legend && (
				<div>
					<legend className="text-lg leading-6 font-medium text-gray-900">
						{legend}
					</legend>
					{legendDesc && (
						<p className="mt-1 text-sm text-gray-500">{legendDesc}</p>
					)}
				</div>
			)}

			{children}
		</fieldset>
	)
}

export function FieldGroup({ id, label, help, children, errors }) {
	return (
		<div>
			<div className="flex justify-between flex-wrap">
				<label htmlFor={id} className={labelClass}>
					{label}
				</label>
				{help && <span className={helpClass}>{help}</span>}
			</div>
			<div className="mt-1 relative rounded-md shadow-sm">{children}</div>
		</div>
	)
}

// TODO
// export function SubForm({ field, values }) {
// 	return (
// 		<div className="my-8">
// 			<h3 className="bold text-lg">{field.name}</h3>
// 			<div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 mt-8">
// 				<div className="px-4 py-5 sm:p-6">
// 					{formData[field.formKey].map((subField) => (
// 						<Field key={subField.name} values={{}} field={subField} />
// 					))}
// 				</div>
// 				<div className="px-4 py-4 sm:px-6">Remove</div>
// 			</div>
// 		</div>
// 	)
// }

export function Field({ field, values }) {
	switch (field.type) {
		// case 'SubForm':
		// 	return <SubForm field={field} values={values} />

		case 'alert':
			return (
				<Alert
					alertType={field.alertType}
					title={field.title}
					children={field.body}
				/>
			)

		case 'Text':
		case 'URL':
			return (
				<FieldGroup id={field.name} label={`${field.label}:`} help={field.help}>
					<input
						name={field.name}
						type={field.type === 'URL' ? 'url' : field.inputType || 'text'}
						required={!!field.required}
						id={field.name}
						className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
						defaultValue={values[field.name]}
					/>
				</FieldGroup>
			)

		case 'Long text':
			return (
				<FieldGroup id={field.name} label={`${field.label}:`} help={field.help}>
					<textarea
						rows="8"
						className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
						name={field.name}
						required={!!field.required}
						id={field.name}
						defaultValue={values[field.name]}
					></textarea>
				</FieldGroup>
			)
		case 'Single select':
			return (
				<RadioList
					id={field.name}
					label={field.label}
					items={field.possibleValues}
					help={field.help}
					defaultValue={values[field.name]}
				/>
			)

		case 'Multiple select':
			return (
				<CheckboxList
					id={field.name}
					label={field.label}
					items={field.possibleValues}
					help={field.help}
					defaultValues={values[field.name]}
					otherFieldName={field.otherFieldName}
					defaultOtherValue={values[field.otherFieldName]}
				/>
			)

		case 'Checkbox':
			return (
				<RadioList
					id={field.name}
					label={field.label}
					items={['Yes', 'No']}
					help={field.help}
					defaultValue={
						values[field.name] === true
							? 'Yes'
							: values[field.name] === false
							? 'No'
							: undefined
					}
				/>
			)

		default:
			return null
	}
}

export function CheckboxList({
	help,
	label,
	items,
	id,
	otherFieldName,
	defaultValues = [],
	defaultOtherValue,
}) {
	return (
		<fieldset>
			<div className="flex justify-between flex-wrap">
				<legend className={labelClass}>{label}</legend>
				{help && <span className={helpClass}>{help}</span>}
			</div>
			<div className="mt-4 grid grid-cols-1 gap-y-4">
				{items.map((item) => (
					<label className="flex items-center" key={item}>
						<input
							name={`${id}[]`}
							value={item}
							type="checkbox"
							className="form-checkbox h-4 w-4 mr-3 text-indigo-600 transition duration-150 ease-in-out"
							defaultChecked={defaultValues && defaultValues.includes(item)}
						/>
						<span className="block leading-5 text-gray-700">{item}</span>
					</label>
				))}

				{otherFieldName && (
					<Disclosure defaultOpen={!!defaultOtherValue}>
						<label className="flex items-center">
							<Disclosure.Button
								as="input"
								value="Other"
								type="checkbox"
								defaultChecked={!!defaultOtherValue}
								className="form-checkbox h-4 w-4 mr-3 text-indigo-600 transition duration-150 ease-in-out"
							/>
							<span className="block leading-5 text-gray-700">Other</span>
						</label>

						<Transition
							enter="transition ease-out duration-100 transform"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="transition ease-in duration-75 transform"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Disclosure.Panel>
								<div className="mt-1 relative rounded-md shadow-sm">
									<input
										name={otherFieldName}
										type="text"
										aria-label="Other"
										defaultValue={defaultOtherValue}
										className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</Disclosure.Panel>
						</Transition>
					</Disclosure>
				)}
			</div>
		</fieldset>
	)
}

export function RadioList({ label, help, items, id, defaultValue }) {
	return (
		<fieldset>
			<div className="flex justify-between flex-wrap">
				<legend className={labelClass}>{label}</legend>
				{help && <span className={helpClass}>{help}</span>}
			</div>
			<div className="mt-4 grid grid-cols-1 gap-y-4">
				{items.map((item, index) => (
					<label className="flex items-center" key={item}>
						<input
							id={`${id}_${index}`}
							name={id}
							value={item}
							type="radio"
							className="form-radio h-4 w-4 mr-3 text-indigo-600 transition duration-150 ease-in-out"
							defaultChecked={defaultValue === item}
						/>
						<span className="block leading-5 text-gray-700">{item}</span>
					</label>
				))}
			</div>
		</fieldset>
	)
}

const defaultState = {
	status: 'initializing',
	fields: {},
}

function createInitialState({
	defaultState,
	session,
	previousFormSubmission,
	errorMessage,
}) {
	if (!session) {
		return defaultState
	}

	// console.log({ create: previousFormSubmission })

	const state = { ...defaultState }

	state.status = 'ready'

	state.fields.Name =
		session?.profile?.Name || session?.githubUser.name || undefined
	state.fields['GitHubUsername'] =
		session?.profile?.Username || session?.githubUser?.login || undefined
	state.fields['TwitterUsername'] =
		session?.profile?.['TwitterUsername'] || undefined
	state.fields['PreferredTimeZone'] =
		session?.profile?.['PreferredTimeZone'] || undefined
	state.fields.Pronouns = session?.profile?.Pronouns || undefined
	state.fields.Email =
		session?.profile?.Email || session?.githubUser?.email || undefined

	state.fields.IsMember = session?.profile?.IsMember || undefined
	state.fields.AllowSocialSharing =
		session?.profile?.AllowSocialSharing || undefined

	if (previousFormSubmission) {
		state.fields = {
			...state.fields,
			...previousFormSubmission,
		}
	}

	if (errorMessage) {
		state.status = 'error'
		state.errorMessage = errorMessage
	}

	// console.log('sdflkjsdfljksdflkjsdlfkjs')
	// console.log(state)

	return state
}

function reducer(state, action) {
	switch (action.type) {
		case 'init':
			return createInitialState(action)

		case 'submit':
			return {
				status: 'loading',
				fields: action.fields,
			}

		case 'finish':
			if (action.status >= 200 && action.status < 300) {
				return {
					status: 'success',
					fields: action.fields,
				}
			}
			return {
				status: 'error',
				errors: action.errors.map((e) => e.message),
				fieldErrors: action.errors.reduce((obj, err) => {
					return {
						...obj,
						[err.field]: [err.message, ...(obj[err.field] || [])],
					}
				}),

				errorMessage: action.message,
				fields: state.fields,
			}

		case 'error':
			return {
				status: 'error',
				fields: state.fields,
				error: action.error,
				errorMessage: action.error?.message,
			}

		default:
			throw new Error(`Undefined action: ${action.type}`)
	}
}

export default function Form({
	session,
	errorMessage,
	previousFormSubmission,
	successView,
	intro,
	formKey,
	fieldsetLegend,
	formFooter = null,
	showProfileFields = true,
	submitText = 'Sign Up!',
}) {
	const [state, dispatch] = useReducer(
		reducer,
		{
			defaultState,
			session,
			previousFormSubmission,
			errorMessage,
		},
		createInitialState
	)
	// console.log({ state })

	useEffect(() => {
		if (state.status === 'error') {
			window.scrollTo(0, 0)
		}
	}, [state.status])

	const onSubmit = useCallback(
		async function (e) {
			e.preventDefault()

			const data = new FormData(e.target)

			const formJson = {}
			data.forEach((stringValue, inputName, ...rest) => {
				if (inputName.indexOf('[]') === -1) {
					formJson[inputName] = stringValue
				} else {
					formJson[inputName.substr(0, inputName.length - 2)] =
						data.getAll(inputName)
				}
			})

			dispatch({ type: 'submit', fields: formJson })

			try {
				const result = await fetch(`/api/forms/${formKey}`, {
					method: 'POST',
					body: JSON.stringify(formJson),
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				})

				const json = await result.json()
				dispatch({ type: 'finish', status: result.status, ...json })
				// console.log({ status: result.status, json })
			} catch (error) {
				// console.log({ error })
				dispatch({ type: 'error', error })
			}
		},
		[dispatch]
	)

	if (state.status === 'success') {
		return successView
	}

	return (
		<>
			{intro && intro}
			{state.status === 'error' && (
				<ErrorAlert title={state.errorMessage} errors={state.errors} />
			)}
			<div className="mt-12">
				<form
					className="space-y-8 divide-y divide-gray-200"
					action={`/api/forms/${formKey}`}
					method="POST"
					name={formKey}
					onSubmit={onSubmit}
				>
					<div className="space-y-8 divide-y divide-gray-200">
						{showProfileFields && (
							<FieldSet
								legend="Your Personal Information"
								disabled={state.status === 'loading'}
							>
								{formData.profile.map((field) => (
									<Field key={field.name} values={state.fields} field={field} />
								))}
							</FieldSet>
						)}

						<FieldSet
							legend={fieldsetLegend}
							disabled={state.status === 'loading'}
						>
							{formData[formKey].map((field) => (
								<Field key={field.name} values={state.fields} field={field} />
							))}

							<div className="mb-6">
								<label className="inline-flex items-center">
									<input
										type="checkbox"
										className="form-checkbox"
										name="agree"
										required
										defaultChecked={!!previousFormSubmission}
									/>
									<span className="ml-2">
										By selecting this, I agree to abide by the{' '}
										<a
											href="https://virtualcoffee.io/code-of-conduct"
											className="font-medium text-gray-700 underline"
										>
											Virtual Coffee Code of Conduct
										</a>
									</span>
								</label>
							</div>

							{formFooter}

							<div className="mt-8 border-t border-gray-200 pt-12">
								<p className="mb-12 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
									Thank you for showing interest in the Virtual Coffee Hacktober
									Initiative!
								</p>
								<div>
									<Button
										size="lg"
										type="submit"
										className="w-full"
										// className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-orange-50 hover:text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
									>
										{state.status === 'loading'
											? 'Loading...'
											: previousFormSubmission
											? 'Save'
											: submitText}
									</Button>
								</div>
							</div>
						</FieldSet>
					</div>
				</form>
			</div>
		</>
	)
}
