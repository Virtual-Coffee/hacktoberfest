import { signInWithGitHub } from '@/lib/auth-client'
import Button from './Button'

export default function SignIn() {
	return (
		<div className="">
			<div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
				<h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
					<span className="block">Step One: Sign In!</span>
				</h2>
				<div className="mt-8 flex justify-center">
					<div className="inline-flex rounded-md shadow-sm">
						<Button size="lg" onClick={() => signInWithGitHub()}>
							Sign in with GitHub
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
