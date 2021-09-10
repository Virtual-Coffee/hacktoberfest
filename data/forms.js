export const profile = [
	{
		name: 'Name',
		type: 'Text',
		label: 'Name',
		required: true,
		help: 'Required',
	},
	{
		name: 'Email',
		type: 'Text',
		inputType: 'email',
		label: 'Email',
		required: true,
		help: 'Required',
	},
	{
		name: 'GitHubUsername',
		type: 'Text',
		label: 'GitHub Username',
		required: true,
		help: 'Required',
	},
	{
		name: 'TwitterUsername',
		type: 'Text',
		label: 'Twitter Username',
		help: 'Optional',
	},
	{
		name: 'Pronouns',
		type: 'Text',
		label: 'Pronouns',
		required: true,
		help: 'Required',
	},
	{
		name: 'IsMember',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label: 'Are you a current Virtual Coffee Member?',
	},
	{
		name: 'AllowSocialSharing',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label:
			'Are you comfortable with Virtual Coffee highlighting (with consent) your project/contributions on Social Media? (Twitter, Instagram)',
	},
]

export const contributors = [
	{
		name: 'OssExperience',
		label: 'What is your experience with Open Source Contribution?',
		type: 'Single select',
		possibleValues: [
			"I've never contributed to OSS before",
			"I've done a few contributions before, but I'm no expert.",
			"I've done many open source contributions before, very familiar with the process",
		],
	},
	{
		name: 'Reasons',
		label:
			'What are your reasons for wanting to contribute to Hacktober month?',
		type: 'Multiple select',
		help: 'Check all that apply',
		possibleValues: [
			'Helping Others/Giving back',
			'Learning new skills/stacks',
			'Improving my GitHub contributions/resume',
			'Working on a good cause',
			'Finding community',
			'Improving social/communication skills',
			'Having fun',
		],
	},
	{ name: 'auth_id', type: 'lookup' },

	{
		name: 'Availability',
		label:
			'How many hours do you think you can dedicate to open source contributions for the month?',
		type: 'Single select',
		possibleValues: ['1-3', '4-9', '10+'],
	},

	{
		name: 'Skills',
		label:
			'What skills/talents/interests would you be willing to practice in your OSS contributions?',
		type: 'Multiple select',
		help: 'Check all that apply',
		possibleValues: [
			'User Testing',
			'Documentation',
			'Front End Development',
			'Back End Development',
			'API/Business Logic',
			'Reporting and Analysis',
			'Project Management/Planning',
			'Unit Testing',
			'Git flow and automation',
			'Accessibility',
		],
	},

	{
		name: 'WillingToAttendSeminar',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label:
			'Would you be willing to attend a zoom seminar for learning how to be an effective contributor?',
	},

	{
		name: 'CommunicationPreferences',
		type: 'Multiple select',
		label:
			'What is your preferred method(s) of communication for collaboration?',
		help: 'Check all that apply',
		possibleValues: [
			'Directly through Github issues',
			'Direct messaging (Async) e.g. Slack, WhatsApp',
			'Email Voice/Video chat via Zoom/Discord/Skype/WhatsApp/Hangouts (you get it)',
		],
	},
	{
		name: 'Activities',
		type: 'Multiple select',
		label: 'Please indicate your interest in any of the following activities:',
		help: 'Check all that apply',
		possibleValues: [
			'Pair Programming Sessions',
			'Code Review Sessions',
			'Git/Github flow coaching',
		],
	},
]
