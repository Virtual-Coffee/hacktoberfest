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
	},
	{
		name: 'Pronouns',
		type: 'Text',
		label: 'Pronouns',
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

export const mentors = [
	{
		name: 'Availability',
		label:
			'How many hours do you think you can dedicate to open source contributions for the month?',
		type: 'Single select',
		possibleValues: ['1-3', '4-9', '10+'],
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
		name: 'Skills',
		label:
			'What skills/talents would you be willing to provide mentorship with?',
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
		otherFieldName: 'SkillsOther',
	},

	{
		name: 'WillingToReadDoc',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label:
			'Would you be willing to read a short document on effective mentorship?',
	},

	{
		name: 'MentorshipStyles',
		type: 'Multiple select',
		label: 'What type of mentorship do you prefer?',
		help: 'Check all that apply',
		possibleValues: [
			'One-on-One',
			'General (Will answer questions in the slack channel, offer open office hours for OSS questions, etc.)',
			"Project-based (I'm willing to work as a mentor to those working on my OSS project)",
		],
	},

	{
		name: 'HowManyMentees',
		type: 'Single select',
		possibleValues: ['1', '2-3', '4-5'],
		label:
			'How many One-to-one mentees would you feel comfortable working with?',
	},
]

export const repos = [
	{
		name: 'RepoName',
		type: 'Text',
		label: 'Repository Name',
		help: 'Required',
		required: true,
	},
	{
		name: 'RepoUrl',
		type: 'URL',
		label: 'Repository URL',
		help: 'Required',
		required: true,
	},
	{
		name: 'Description',
		type: 'Long text',
		label: 'Tell us about your project',
		help: 'Required',
		required: true,
	},
]

export const maintainers = [
	// {
	// 	name: 'Projects',
	// 	type: 'SubForm',
	// 	formKey: 'repos',
	// 	multiple: true,
	// },
	{
		name: 'Projects',
		type: 'Long text',
		label: 'Tell us about your project(s)',
		help: 'Required, make sure to add links!',
		required: true,
	},
	{
		name: 'HowManyHours',
		type: 'Single select',
		possibleValues: ['1-3', '4-9', '10+'],
		label:
			'How many hours do you think you can dedicate to reviewing PRs contributed by open source contributors during Hacktoberfest?',
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
		name: 'HelpNeeded',
		type: 'Multiple select',
		label: 'What areas do you feel like you need/want help on the most?',
		help: 'Check all that apply',
		possibleValues: [
			'User Testing',
			'Documentation',
			'Front End Development',
			'Back End Development',
			'Project Management/Planning',
			'Unit Testing',
			'Git flow and automation',
		],
		otherFieldName: 'HelpNeededOther',
	},

	{
		name: 'WillingToWatchMaintainerVideo',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label:
			'Would you be willing to watch a Virtual Coffee video that shares maintainer best practices?',
	},

	{
		name: 'Goals',
		type: 'Multiple select',
		label: 'What are your goals with this project?',
		help: 'Check all that apply',
		possibleValues: [
			'Chance to learn and develop new skills',
			'Portfolio piece to land a tech job',
			'Social/benefit the community',
			'Solve a specific problem',
			'Proof of concept for current/future business',
			'Just having fun',
		],
		otherFieldName: 'GoalsOther',
	},
	{
		name: 'EffortPriority',
		type: 'Single select',
		possibleValues: [
			'High priority (heavily invested in project completion/maturation)',
			"Medium priority (would like to finish project, but it's not critical)",
			'Low priority (very casual endeavour, no explicit goals/timelines)',
		],
		label:
			'How much do you want to prioritize your efforts as a project maintainer?',
	},
	{
		name: 'MentoringContributors',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label:
			'Are you interested in mentoring your contributors (pair programming sessions, code review sessions, etc.)?',
	},
	{
		name: 'ComfortableWorkingWithContributors',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label: 'Are you comfortable working hands-on with your contributors?',
	},
]
