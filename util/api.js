export async function getContributorSubmission() {
	const response = await fetch('/api/forms/contributors', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	if (!response.ok) {
		return null
	}
	return response.json()
}
