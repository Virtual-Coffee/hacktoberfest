import { createFormApiHandler } from '@/util/formApiHandler'

export default createFormApiHandler({
	formKey: 'maintainers',
	page: 'maintainers',
	includeProfile: true,
	multiple: false,
})
