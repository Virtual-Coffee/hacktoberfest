import { createFormApiHandler } from '@/util/formApiHandler'

export default createFormApiHandler({
	formKey: 'nonPrContributions',
	page: 'non-pr-contributions',
	includeProfile: false,
	multiple: true,
})
