import { Disclosure, Transition } from '@headlessui/react'
import { useCallback, useEffect, useReducer } from 'react'
import * as formData from '../data/forms'
import Alert from './Alert'
import Button from './Button'

const labelClass = 'block text-lg leading-6 text-gray-700'
const helpClass = 'text-sm leading-6 text-gray-500'

export function FieldGroup({ id, label, help, children, errors }) {
	return (
		<div className="mb-12">
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

export function Field({ field, values }) {
	switch (field.type) {
		case 'Text':
		case 'URL':
			return (
				<FieldGroup id={field.name} label={`${field.label}:`} help={field.help}>
					<input
						name={field.name}
						type={field.type === 'URL' ? 'url' : field.inputType || 'text'}
						required={!!field.required}
						id={field.name}
						className="form-input py-3 px-4 block w-full transition ease-in-out duration-150"
						defaultValue={values[field.name]}
					/>
				</FieldGroup>
			)

		case 'Long text':
			return (
				<FieldGroup id={field.name} label={`${field.label}:`} help={field.help}>
					<textarea
						rows="4"
						className="form-textarea py-3 px-4 block w-full transition ease-in-out duration-150"
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
}) {
	return (
		<fieldset className="mb-12">
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
					<Disclosure>
						<label className="flex items-center">
							<Disclosure.Button
								as="input"
								name={`${id}[]`}
								value="Other"
								type="checkbox"
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
										aria-label="Other"
										className="form-input py-3 px-4 block w-full transition ease-in-out duration-150"
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
		<fieldset className="mb-12">
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
				<Alert message={state.errorMessage} errors={state.errors} />
			)}
			<div className="mt-12">
				<form
					action={`/api/forms/${formKey}`}
					method="POST"
					name={formKey}
					onSubmit={onSubmit}
				>
					<fieldset disabled={state.status === 'loading'}>
						<legend>Your Personal Information</legend>

						{formData.profile.map((field) => (
							<Field key={field.name} values={state.fields} field={field} />
						))}
					</fieldset>

					<fieldset disabled={state.status === 'loading'}>
						<legend>Tell us about yourself!</legend>

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

						<div className="rounded-md bg-blue-50 p-4">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-blue-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm leading-5 font-medium text-blue-800">
										Please note:
									</h3>
									<div className="mt-2 text-sm leading-5 text-blue-700">
										<p>
											Although we would love to support everyone in their Open
											Source journey, we're still a very small team with limited
											resources. Priority for pairings will be given to Virtual
											Coffee Community members (attended at least one of the
											Virtual Coffee Zoom calls)
										</p>
									</div>
								</div>
							</div>
						</div>

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
										: 'Sign Up!'}
								</Button>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
		</>
	)
}
