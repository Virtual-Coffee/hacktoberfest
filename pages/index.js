import ChoiceCard from '../components/ChoiceCard'
import Layout from '../components/Layout'
import Head from 'next/head'
import { useNewSubmissionsClosed } from '../util/globals'
import { useMemo } from 'react'

const getChoices = function (newSubmissionsClosed) {
	return [
		{
			header: 'Contributors',
			intro:
				"Are you a Virtual Coffee member interested in participating in Hacktoberfest (or open source in general), but don't know where to start? Or are you an experienced developer looking to complete Hacktoberfest as part of the Virtual Coffee Community? We'd love to help! Come join our Hacktoberfest Initiative and get the support you need to complete the challenge.",
			items: [
				'Learn OSS essentials',
				'Complete Hacktoberfest Challenge',
				'Join a great community of developers',
			],
			button: newSubmissionsClosed
				? {
						text: 'All full!',
						disabled: true,
						link: '/contributors',
				  }
				: {
						text: 'I Want to Hack!',
						link: '/contributors',
				  },
		},
		{
			header: 'Maintainers',
			intro:
				"Are you an open source maintainer who is interested in participating in Hacktoberfest? We're looking for some OSS maintainers to partner with in order to provide a welcoming environment to our contributors as they start or continue their open source journey.",
			items: [
				'Find some excited contributors for your project',
				'Grow your community',
				'Join a great community of developers',
			],
			button: newSubmissionsClosed
				? {
						text: 'All Full!',
						disabled: true,
						link: '/maintainers',
				  }
				: {
						text: 'I Have Issues!',
						link: '/maintainers',
				  },
		},
		{
			header: 'Mentors',
			intro:
				"Have a few pull requests under your belt, and are looking for ways to give back to the community? Virtual Coffee's Hacktoberfest Initiative is a great place to provide high-impact help to a few early-career contributors.",
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
					content="Virtual Coffee is gearing up for Hacktoberfest 2024 and we want you to join us!"
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
						Hacktoberfest 2024
					</a>{' '}
					and we want our Virtual Coffee members to join us!
				</p>
				<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
					Our plan is to harness the power in our community to help developers
					become excited about contributing to Open Source Software, and to
					contribute to some of our favorite Open Source repositories along the
					way.
				</p>

				<div className="italic mt-3 max-w-md mx-auto text-sm text-gray-700 sm:text-md md:mt-5 md:text-lg md:max-w-3xl">
					<p>
						The Virtual Coffee Hacktoberfest Initiative is proud to be sponsored
						by
					</p>
					<a
						href="https://dub.sh/PWT19Ra"
						title="Clerk: Authentication and User Management"
					>
						<svg
							width="1216"
							height="353"
							viewBox="0 0 1216 353"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-3/4 mx-auto"
						>
							<ellipse
								cx="176.412"
								cy="176.384"
								rx="55.1172"
								ry="55.1174"
								fill="#131316"
							/>
							<path
								d="M275.721 306.885C280.41 311.574 279.939 319.338 274.429 323.028C246.394 341.807 212.676 352.759 176.399 352.759C140.122 352.759 106.403 341.807 78.3679 323.029C72.858 319.338 72.3871 311.574 77.0765 306.885L117.356 266.605C120.996 262.965 126.644 262.39 131.226 264.737C144.774 271.678 160.129 275.595 176.399 275.595C192.668 275.595 208.023 271.678 221.572 264.737C226.154 262.39 231.801 262.965 235.442 266.605L275.721 306.885Z"
								fill="#131316"
							/>
							<path
								opacity="0.5"
								d="M274.443 29.7392C279.953 33.4298 280.424 41.1935 275.734 45.8829L235.455 86.1623C231.815 89.8027 226.167 90.3777 221.585 88.0304C208.036 81.0893 192.682 77.1732 176.412 77.1732C121.62 77.1732 77.2015 121.592 77.2015 176.385C77.2015 192.654 81.1176 208.009 88.0587 221.558C90.406 226.14 89.831 231.787 86.1906 235.428L45.9114 275.707C41.222 280.396 33.4583 279.925 29.7677 274.415C10.9896 246.381 0.0374756 212.662 0.0374756 176.385C0.0374756 78.9749 79.0032 0.00878906 176.412 0.00878906C212.689 0.00878906 246.408 10.9609 274.443 29.7392Z"
								fill="#131316"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M575.992 35.8369C575.992 34.3149 577.226 33.0811 578.748 33.0811H620.085C621.607 33.0811 622.841 34.3149 622.841 35.8369V316.936C622.841 318.458 621.607 319.692 620.085 319.692H578.748C577.226 319.692 575.992 318.458 575.992 316.936V35.8369ZM517.653 260.069C516.554 259.121 514.913 259.192 513.857 260.188C507.415 266.269 499.869 271.134 491.601 274.527C482.53 278.252 472.779 280.126 462.943 280.039C454.637 280.285 446.367 278.864 438.643 275.864C430.92 272.863 423.905 268.347 418.032 262.593C407.363 251.702 401.223 236.151 401.223 217.613C401.223 180.504 425.911 155.122 462.943 155.122C472.876 154.985 482.717 156.997 491.763 161.012C499.963 164.652 507.328 169.858 513.428 176.314C514.472 177.419 516.204 177.546 517.353 176.552L545.261 152.404C546.401 151.417 546.54 149.695 545.534 148.572C524.542 125.114 491.656 113.002 460.383 113.002C397.415 113.002 352.766 155.476 352.766 217.966C352.766 248.873 363.863 274.898 382.576 293.276C401.288 311.653 427.947 322.448 458.708 322.448C497.278 322.448 528.322 307.657 546.523 288.683C547.591 287.57 547.473 285.798 546.305 284.79L517.653 260.069ZM850.558 231.369C850.405 232.749 849.23 233.782 847.841 233.782H703.032C701.272 233.782 699.962 235.414 700.42 237.112C707.625 263.819 729.104 279.978 758.423 279.978C768.305 280.186 778.101 278.152 787.055 274.035C795.397 270.199 802.798 264.65 808.761 257.771C809.483 256.939 810.74 256.816 811.585 257.522L840.698 282.87C841.812 283.84 841.967 285.518 841.012 286.645C823.435 307.382 794.956 322.448 755.874 322.448C695.752 322.448 650.4 280.813 650.4 217.558C650.4 186.525 661.084 160.502 678.891 142.127C688.291 132.678 699.56 125.221 712.001 120.215C724.442 115.209 737.794 112.761 751.234 113.021C812.172 113.021 851.578 155.877 851.578 215.052C851.502 220.504 851.162 225.95 850.558 231.369ZM701.29 192.964C700.778 194.665 702.093 196.322 703.869 196.322H800.155C801.935 196.322 803.25 194.655 802.755 192.945C796.192 170.232 779.543 155.074 753.684 155.074C746.078 154.832 738.51 156.209 731.494 159.108C724.48 162.009 718.183 166.364 713.037 171.875C707.627 178.01 703.626 185.203 701.29 192.964ZM994.854 113.032C996.388 113.016 997.64 114.254 997.64 115.788V162.071C997.64 163.675 996.275 164.939 994.676 164.821C990.208 164.49 985.985 164.208 983.217 164.208C947.157 164.208 925.988 189.587 925.988 222.9V316.937C925.988 318.459 924.754 319.692 923.232 319.692H881.894C880.372 319.692 879.138 318.459 879.138 316.937V118.649C879.138 117.127 880.372 115.893 881.894 115.893H923.232C924.754 115.893 925.988 117.127 925.988 118.649V146.48C925.988 146.637 926.115 146.765 926.272 146.765C926.362 146.765 926.446 146.722 926.5 146.65C942.66 125.071 966.51 113.066 991.707 113.066L994.854 113.032ZM1106.83 234.247C1107 234.066 1107.24 233.963 1107.49 233.963C1107.79 233.963 1108.08 234.122 1108.24 234.384L1160.51 318.392C1161.02 319.2 1161.9 319.692 1162.85 319.692H1209.84C1212 319.692 1213.32 317.32 1212.19 315.484L1140.48 199.784C1139.83 198.74 1139.95 197.393 1140.78 196.482L1209.87 120.254C1211.47 118.483 1210.22 115.648 1207.83 115.648H1158.8C1158.03 115.648 1157.29 115.972 1156.77 116.541L1076.84 203.675C1075.14 205.527 1072.05 204.325 1072.05 201.812V35.8369C1072.05 34.3149 1070.82 33.0811 1069.29 33.0811H1027.96C1026.43 33.0811 1025.2 34.3149 1025.2 35.8369V316.936C1025.2 318.458 1026.43 319.692 1027.96 319.692H1069.29C1070.82 319.692 1072.05 318.458 1072.05 316.936V272.702C1072.05 272.005 1072.31 271.334 1072.79 270.824L1106.83 234.247Z"
								fill="#131316"
							/>
						</svg>
					</a>
				</div>
			</div>

			<div className=" py-8">
				<div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
					<h2 className="text-3xl leading-9 font-extrabold text-gray-900">
						Join us for Hacktoberfest:
					</h2>
					<div className="text-base leading-6 text-gray-500">
						*Choose as many roles as you like. Mentorship only guaranteed if
						you're a Virtual Coffee member who registers before September 28th.
					</div>
					<div className="mt-6 border-t-2 border-gray-100 pt-10 space-y-4  lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
						{choices.map((choice) => (
							<ChoiceCard key={choice.header} choice={choice} />
						))}
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
								What is Hacktoberfest?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-2">
								<p className="text-base leading-6 text-gray-500">
									Hacktoberfest is a month-long virtual event encouraging and
									supporting open-source contributions sponsored by Digital
									Ocean. Open Source Software (OSS) is code the public can view,
									contribute to, and use. A contributor can complete
									Hacktoberfest by{' '}
									<a
										href="https://hacktoberfest.com/"
										className="text-orange-500 underline"
									>
										registering
									</a>{' '}
									and getting four pull requests (PRs) accepted by maintainers
									in repositories with the "Hacktoberfest" topic or labeled
									"hacktoberfest-accepted" between October 1-31.
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
									an open source project as a pull request on GitHub but usually
									does not have the ability to merge their contributions.
									Contributors can find issues to work on in open source
									repositories. To get started as an open source contributor for
									Hacktoberfest, all you need to do is to{' '}
									<a
										href="https://hacktoberfest.com/"
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
									Slack channels, a group coding session, a review of the
									project you're using for Hacktoberfest, or general community
									support. We're also here to cheer you on throughout the month,
									whether on social media, through our events, or Slack.
								</p>
							</dd>
							<dt className="text-lg leading-6 font-medium text-gray-900 md:col-start-2 md:row-start-7">
								How many roles can I take on?
							</dt>
							<dd className="mt-2 mb-8 md:col-start-2 md:row-start-8">
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
