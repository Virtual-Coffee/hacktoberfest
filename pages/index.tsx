import ChoiceCard, { type Choice } from '@/components/ChoiceCard'
import Layout from '@/components/Layout'
import Head from 'next/head'
import { currentYear, useNewSubmissionsClosed } from '@/util/globals'
import { useMemo } from 'react'

const getChoices = function (newSubmissionsClosed: boolean): Choice[] {
	return [
		{
			header: 'Contributors',
			intro:
				"Are you part of Virtual Coffee, or one of our participating communities and companies, who wants to contribute to open source but doesn't know where to start? Or have you contributed to open source before and want to keep making quality contributions? We'd love to help! Come join OSWeave and get the support you need.",
			items: [
				'Learn open-source essentials',
				'Contribute to real-world projects',
				'Connect with people across open-source communities',
			],
			button: newSubmissionsClosed
				? {
						text: 'All full!',
						disabled: true,
						link: '/contributors',
					}
				: {
						text: 'I Want to Contribute!',
						link: '/contributors',
					},
		},
		{
			header: 'Maintainers',
			intro:
				"Do you have an open-source project and are looking for contributors? OSWeave connects you with contributors who are ready to make quality, sustainable contributions to your project.",
			items: [
				'Find contributors for your project',
				'Grow your community',
				'Connect with people across open-source communities',
			],
			button: newSubmissionsClosed
				? {
						text: 'All Full!',
						disabled: true,
						link: '/maintainers',
					}
				: {
						text: 'We Have Issues!',
						link: '/maintainers',
					},
		},
		{
			header: 'Mentors',
			intro:
				'Have a few pull requests under your belt and want to give back? Join our pool of OSWeave mentors. Help out open-source contributors in Slack, or hold your own open office hours, whatever fits your schedule.',
			items: [
				'Give back to the community',
				'Have some fun',
				'Connect with people across open-source communities',
			],
			button: {
				text: "I'd Love to Help!",
				link: '/mentors',
			},
		},
	]
}

export default function Page() {
	const newSubmissionsClosed = useNewSubmissionsClosed()
	const choices = useMemo(
		() => getChoices(newSubmissionsClosed),
		[newSubmissionsClosed]
	)
	return (
		<Layout>
			<Head>
				<title>Virtual Coffee Hacktoberfest Initiative</title>
				<meta
					name="description"
					content={`Virtual Coffee is gearing up for Hacktoberfest ${currentYear} and we want you to join us!`}
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
						href="https://hacktoberfest.com"
						className="text-orange-500 underline"
					>
						Hacktoberfest {currentYear}
					</a>{' '}
					and we want our Virtual Coffee members to join us!
				</p>
				<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
					Our plan is to harness the power in our community to help developers
					become excited about contributing to Open Source Software, and to
					contribute to some of our favorite Open Source repositories along the
					way.
				</p>
			</div>

			<div className="py-8">
				<div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-screen-xl lg:px-8 py-6">
					<h2 className="text-3xl leading-9 font-extrabold text-gray-900">
						Join us for OSWeave:
					</h2>
					<div className="text-base leading-6 text-gray-500">
						*Choose as many roles as you like.
					</div>
					<div className="mt-6 border-t-2 border-gray-100 pt-10 space-y-4  lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
						{choices.map((choice) => (
							<ChoiceCard key={choice.header} choice={choice} />
						))}
					</div>
				</div>
			</div>

			<div className="" id="vchi-to-osweave">
				<div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-screen-xl lg:px-8 py-6">
					<h2 className="text-3xl leading-9 font-extrabold text-gray-900">
						From VCHI to OSWeave
					</h2>
					<div className="mt-6 border-t-2 border-gray-100 pt-10 space-y-4">
						<p className="text-base leading-6 text-gray-500">
							Virtual Coffee took part in Hacktoberfest every October from 2021
							to 2025, through the Virtual Coffee Hacktoberfest Initiative
							(VCHI). VCHI helped people make their first open source
							contributions. For members who wanted to contribute, it helped
							them find repositories, answered their questions, supported them
							throughout the event, and offered mentorship to first-timers. For
							members who maintain open source projects, it helped them get
							their repositories ready for contributions and promote them.
						</p>
						<p className="text-base leading-6 text-gray-500">
							Hacktoberfest is moving in a different direction in 2026. It now
							focuses on open source AI, and pull requests no longer count
							toward rewards.
						</p>
						<p className="text-base leading-6 text-gray-500">
							That change led to OSWeave, an idea from Dominic Duffin, founder
							of HCLB Communities and a Monthly Challenge Team Lead at Virtual
							Coffee. It is a new initiative that nurtures quality contributions
							to open source in a way that is sustainable in the age of AI. This
							fall, we will run our traditional event as part of the OSWeave
							pilot, working with HCLB as the infrastructure partner.
						</p>
					</div>
				</div>
			</div>

			<div className="" id="questions">
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
									stages of the journey. Our mission is to be a welcoming tech
									community that allows room for growth and mentorship at all
									levels, and to create meaningful opportunities for learning,
									leadership, and contribution for everyone. We do a little bit
									of everything, which includes a thriving Slack group, special
									events, twice-weekly meetings, a podcast and newsletter, and
									good people. All new members are invite only from our active
									volunteers.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-1">
								What is HCLB Communities?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-2">
								<p className="text-base leading-6 text-gray-500">
									HCLB Communities are a community ecosystem startup building 
									online communities and events for founders, techies and startup 
									people. They are a tech company with a human touch, here to build 
									online communities that nurture genuine connection between real 
									people, and brands that speak to the values of human creativity 
									and community, and to enable others to do the same. They are also 
									currently working behind the scenes on internal software to power 
									their programs, much of which will be open sourced in due course.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-1 md:row-start-3">
								What is OSWeave?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-1 md:row-start-4">
								<p className="text-base leading-6 text-gray-500">
									OSWeave is a project from{' '}
									<a
										href="https://www.hclbcommunities.com/"
										className="text-orange-500 underline"
									>
										HCLB Communities
									</a>
									. It brings together tech communities, companies, and
									maintainers to nurture quality contributions to open source
									projects in the age of AI. To do this, we coordinate
									contributors and maintainers from selected partners, and we
									give T-shirt rewards for contributions. Participation is
									controlled to avoid a flood of low-effort contributions. This
									means contributors join only through participating
									communities and corporate partners. The Fall 2026 event is a pilot that
									HCLB Communities and Virtual Coffee are running together. We are also
									inviting other carefully chosen partners to join.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-3">
								What are the roles of HCLB Communities and Virtual Coffee in OSWeave?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-4">
								<p className="text-base leading-6 text-gray-500">
									HCLB Communities is the overall operator of OSWeave and responsible
									for the program design, coordinating the project, and the future
									development of OSWeave after the Fall 2026 pilot project. They will
									also be sending out T-shirt rewards to participants (the requirements
									will be announced later).

								</p>
								<p className="mt-4 text-base leading-6 text-gray-500">
									Virtual Coffee is participating in OSWeave as the
									Infrastructure Partner, which means we are responsible for the
									sign-up and community infrastructure required to run the Fall
									2026 pilot project. We are also participating as a Community
									Partner, meaning Virtual Coffee members will be participating
									as contributors.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-1 md:row-start-5">
								What is a Maintainer?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-1 md:row-start-6">
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

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-5">
								What is a Contributor and what do I need to get started?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-6">
								<p className="text-base leading-6 text-gray-500">
									A contributor is anyone who gives their time or skills to
									help an open source project. This can include writing code,
									but it doesn't have to. Designing graphics, writing blog
									posts, and helping with community engagement are all
									examples of non-code contributions, and there are many
									other ways to contribute too. The most common path is
									submitting a pull request on GitHub, though contributors
									usually cannot merge their own changes. Issues in open
									source repositories are a good place to find work that
									matches your interests. To get started with OSWeave,{' '}
									<a
										href="/contributors"
										className="text-orange-500 underline"
									>
										sign up
									</a>{' '}
									and have (or create) a{' '}
									<a
										href="https://github.com/"
										className="text-orange-500 underline"
									>
										Github account
									</a>
									.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-1 md:row-start-7">
								Why should I partner with OSWeave?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-1 md:row-start-8">
								<p className="text-base leading-6 text-gray-500">
									Content coming soon...
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-7">
								Who can participate in OSWeave?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-8">
								<p className="text-base leading-6 text-gray-500">
									Content coming soon...
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-1 md:row-start-9">
								Does it cost anything to participate in OSWeave?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-1 md:row-start-10">
								<p className="text-base leading-6 text-gray-500">
									Participation is free for all eligible contributors and
									independent maintainers. Organizations can participate as
									maintainer for free if they meet OSWeave&apos;s definition of a
									small non-profit, which covers most organizations that
									don&apos;t distribute profits to owners and have an annual
									revenue of less than $500,000. HCLB Communities will reach out
									to maintainers who sign up with organization projects to
									confirm their organization&apos;s status and any costs for
									participation.
								</p>
							</dd>

							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-9">
								What type of support will there be?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-10">
								<p className="text-base leading-6 text-gray-500">
									Content coming soon...
								</p>
								{/* <p className="text-base leading-6 text-gray-500">
									Because not everyone will need the same level or type of
									support, we're working to accommodate as many needs as
									possible. This could include 1:1 mentorship, access to private
									Slack channels, a group coding session, a review of the
									project you're using for Hacktoberfest, or general community
									support. We're also here to cheer you on throughout the month,
									whether on social media, through our events, or Slack.
								</p> */}
							</dd>
							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-11">
								How many roles can I take on?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-12">
								<p className="text-base leading-6 text-gray-500">
									The short answer is as many as you want! If you want to be a
									maintainer, mentor, and contributor, you can. But we know that
									this can be really time consuming, so we ask that you
									carefully consider how much you can take on, especially as a
									mentor and maintainer who will be supporting others.
								</p>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</Layout>
	)
}
