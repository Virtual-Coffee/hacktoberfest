import { githubSignInConfigured, signInWithGitHub } from '@/lib/auth-client'
import Button from './Button'

type GitHubSignInButtonProps = {
	size?: 'sm' | 'lg'
}

export default function GitHubSignInButton({
	size = 'sm',
}: GitHubSignInButtonProps) {
	if (!githubSignInConfigured) {
		// Locally this is a contributor without GitHub credentials, who signs
		// in through the devtools panel instead. On a deploy it is a
		// misconfiguration, and that panel is not there.
		return (
			<p className="text-sm text-gray-500 whitespace-nowrap">
				{process.env.NODE_ENV === 'development'
					? 'Sign in via Auth DevTools'
					: 'Sign-in unavailable'}
			</p>
		)
	}

	return (
		<Button size={size} onClick={() => signInWithGitHub()}>
			Sign in with GitHub
		</Button>
	)
}
