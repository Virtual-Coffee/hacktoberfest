import { createFormApiHandler } from '@/util/formApiHandler'

export default createFormApiHandler({
	formKey: 'mentors',
	page: 'mentors',
	includeProfile: true,
	multiple: false,
})
