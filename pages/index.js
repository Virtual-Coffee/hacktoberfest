import ChoiceCard from '../components/ChoiceCard'
import Layout from '../components/Layout'
import Head from 'next/head'

const choices = [
	{
		header: 'Contributors',
		intro:
			"Are you interested in participating in Hacktoberfest (or Open Source in general), but don't know where to start? Or are you an experienced developer looking to complete Hacktoberfest as part of the Virtual Coffee Community? We'd love to help! Come join our Hacktoberfest Initiative and get the support you need to complete the challenge.",
		items: [
			'Learn OSS essentials',
			'Complete Hacktoberfest Challenge',
			'Join a great community of developers',
		],
		button: {
			text: 'I Want to Hack!',
			link: '/contributors',
		},
	},
	{
		header: 'Maintainers',
		intro:
			"Are you an Open Source maintainer who is interested in participating in Hacktoberfest? We're looking for some OSS maintainers to partner with in order to provide a welcoming environment to our Contributors as they start or continue their open source journey.",
		items: [
			'Find some excited contributors for your project',
			'Grow your community',
			'Join a great community of developers',
		],
		button: {
			text: 'I Have Issues!',
			link: '/maintainers',
		},
	},
	{
		header: 'Mentors',
		intro:
			"Have a few Pull Requests under your belt, and are looking for ways to give back to the community? Virtual Coffee's Hacktoberfest Initiative is a great place to provide high-impact help to a few early-career Contributors.",
		items: [
			'Give back to the community',
			'Have some fun',
			'Join a great community of developers',
		],
		button: {
			text: "I'd Love to Help!",
			link: '/mentors',
		},
	},
]

export default function Page() {
	return (
		<Layout>
			<Head>
				<title>Virtual Coffee Hacktoberfest Initiative</title>
				<meta
					name="description"
					content="Virtual Coffee is gearing up for Hacktoberfest 2021 and we want you to join us!"
				/>
			</Head>
			<div className="text-center">
				<h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
					Virtual Coffee:
					<br className="xl:hidden" />
					<span className="text-orange-500"> Hacktoberfest Initiative</span>
				</h2>
				<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
					Virtual Coffee is gearing up for{' '}
					<a
						className="text-orange-500 underline"
						href="https://hacktoberfest.digitalocean.com"
					>
						Hacktoberfest 2021
					</a>{' '}
					and we want you to join us!
				</p>
				<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
					Our plan is to harness the power in our community to help developers
					become excited about contributing to Open Source Software, and to
					contribute to some of our favorite Open Source repositories along the
					way.
				</p>
			</div>

			<div className="mt-12 lg:mt-20 py-12 bg-white">
				<div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
					<h2 className="text-3xl leading-9 font-extrabold text-gray-900">
						Join us for Hacktoberfest:
					</h2>

					<div className="mt-6 border-t-2 border-gray-100 pt-10 space-y-4  lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
						{choices.map((choice) => (
							<ChoiceCard key={choice.header} choice={choice} />
						))}
					</div>
				</div>
			</div>

			<div className="bg-white" id="questions">
				<div className="max-w-screen-xl mx-auto pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:pt-20 lg:pb-28 lg:px-8">
					<h2 className="text-3xl leading-9 font-extrabold text-gray-900">
						Questions:
					</h2>
					<div className="mt-6 border-t-2 border-gray-100 pt-10">
						<dl className="md:grid md:grid-cols-2 md:gap-x-8">
							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-1 md:row-start-1">
								What is Virtual Coffee?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-1 md:row-start-2">
								<p className="text-base leading-6 text-gray-500">
									Virtual Coffee is a supportive community of developers at all
									stages of the journey. It started as a twice-weekly zoom chat
									about life and tech, but we've grown a lot in the last five
									months! We do a little bit of everything, which includes a
									thriving slack group, special events, mentoring sessions, and
									good people. If you're interested in joining, you can come to
									an event by signing up{' '}
									<a
										href="https://meetingplace.io/virtual-coffee"
										className="text-orange-500 underline"
									>
										here
									</a>
									.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-1">
								What is Hacktoberfest?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-2">
								<p className="text-base leading-6 text-gray-500">
									Hacktoberfest is a month-long virtual event that encourages
									and supports open-source contributions. Open Source Software
									(OSS) is code that the public can view, contribute to, and
									use. Sponsored by Digital Ocean and DEV, a contributor can
									qualify for the official Hacktoberfest swag by{' '}
									<a
										href="https://hacktoberfest.digitalocean.com"
										className="text-orange-500 underline"
									>
										registering
									</a>{' '}
									and making four pull requests (PRs) between October 1-31.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-1 md:row-start-3">
								What is a Maintainer?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-1 md:row-start-4">
								<p className="text-base leading-6 text-gray-500">
									Maintainers are the owners of the open source project. They
									keep track of the work, review incoming PR requests and
									issues, and make sure things get merged. They keep the project
									up to date and when possible connect developers to issues.
									Good maintainers aren't necessarily the best coders or
									reviewers, but they help others navigate the project and
									anticipate and remove difficulties when they can.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-3">
								What is a Contributor and what do I need to get started?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-4">
								<p className="text-base leading-6 text-gray-500">
									A contributor is someone who submits code or documentation to
									an open source project as a pull request on Github but usually
									does not have the ability to merge their contributions.
									Contributors can find issues to work on in open source
									repositories. To get started as an open source contributor for
									Hacktoberfest, all you need to do is to{' '}
									<a
										href="https://hacktoberfest.digitalocean.com/"
										className="text-orange-500 underline"
									>
										sign up
									</a>{' '}
									and have/create a{' '}
									<a
										href="https://github.com/"
										className="text-orange-500 underline"
									>
										Github account
									</a>
									.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-1 md:row-start-5">
								Why should I partner with Virtual Coffee for Hacktoberfest?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-1 md:row-start-6">
								<p className="text-base leading-6 text-gray-500">
									Our goal is to provide support for contributors and
									maintainers. We want everyone to have an opportunity to
									contribute, regardless of their experience. Likewise, we want
									to provide maintainers with support to create projects that
									are contributor-friendly and will lead to repeat contributions
									beyond Hacktoberfest. Our goal is to make tech a friendly
									place for everyone.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-5">
								What type of support will there be?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-6">
								<p className="text-base leading-6 text-gray-500">
									Because not everyone will need the same level or type of
									support, we're working to accommodate as many needs as
									possible. This could include 1:1 mentorship, access to private
									slack channels, a group coding session, a review of the
									project you're using for Hacktoberfest, or general community
									support. We're also here to cheer you on throughout the month,
									whether on social media, through our events, or slack.
								</p>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</Layout>
	)
}
