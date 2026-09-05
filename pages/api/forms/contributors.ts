import { createFormApiHandler } from '@/util/formApiHandler'

export default createFormApiHandler({
	formKey: 'contributors',
	page: 'contributors',
	includeProfile: true,
	multiple: false,
})
