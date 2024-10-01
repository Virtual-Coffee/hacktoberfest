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
		name: 'PreferredTimeZone',
		type: 'Text',
		label: 'Preferred Time Zone',
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
		required: true,
		help: 'You must be a VC member to participate in our Virtual Coffee Hacktoberfest Initiative as a Contributor or Mentor.',
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
			"I've done a few contributions before, but I'm no expert",
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
			'Helping others/giving back',
			'Learning new skills/stacks',
			'Improving my GitHub contributions/resume',
			'Working on a good cause',
			'Finding community',
			'Improving social/communication skills',
			'Having fun',
		],
		otherFieldName: 'ReasonsOther',
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
			'Git Flow and Automation',
			'Accessibility',
		],
		otherFieldName: 'SkillsOther',
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
			'Git/GitHub Flow Coaching',
		],
	},
	{
		name: 'RequestedMentor',
		type: 'Single select',
		possibleValues: ['Yes', 'No'],
		label: 'I would like to be paired with a mentor for Hacktoberfest',
	},
	{
		name: 'Note',
		type: 'alert',
		alertType: 'info',
		title: 'Please note:',
		body: (
			<p>
				Although we would love to support everyone in their Open Source journey,
				we're still a very small team with limited resources. We will do our
				best to pair you with a mentor, but we can't guarantee it.
			</p>
		),
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

export const nonPrContributions = [
	{
		name: 'RepoName',
		type: 'Text',
		label: 'Repository Name',
	},
	{
		name: 'RepoUrl',
		type: 'URL',
		label: 'Repository URL',
	},
	{
		name: 'ContributionDescription',
		type: 'Long text',
		label:
			'Tell us about your contribution. If you made multiple contributions, please submit a separate form for each one so they get counted! Examples of meaningful, non-code contributions: content that supports or helps an open source project, a substantial PR review, triaging 3 or more issues, facilitating an open source event, writing a detailed issue.',
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
		type: 'alert',
		alertType: 'warning',
		name: 'projectnote',
		title: 'Please note:',
		body: (
			<>
				<p>
					All projects and repositories are evaluated by Virtual Coffee staff
					before being shared with our members.{' '}
				</p>
				<p>
					Please take a look at our{' '}
					<a
						href="https://virtualcoffee.io/resources/open-source/maintainer-guide"
						className="font-medium underline text-yellow-700 hover:text-yellow-600"
					>
						Maintainer's Checklist
					</a>{' '}
					to ensure your project has everything it needs to support Open Source
					Contributions.
				</p>
				<p>
					If your project needs some work to meet these requirements, please
					still fill out this form, and we may be able to support your efforts
					to prepare for Hacktoberfest!
				</p>
			</>
		),
	},
	{
		name: 'ProjectsRequirementsStatus',
		type: 'Single select',
		required: true,
		help: 'Required',
		possibleValues: [
			'My project meets these requirements',
			"I'm in the process of updating my project",
			'I would like some help updating my project ',
		],
		label: 'Are your projects ready for Open Source Contributors?',
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
			'Email',
			'Voice/Video chat via Zoom/Discord/Skype/WhatsApp/Hangouts (you get it)',
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
]
