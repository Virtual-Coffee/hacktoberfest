import { githubSignInConfigured, signInWithGitHub } from '@/lib/auth-client'
import Button from './Button'

type GitHubSignInButtonProps = {
	size?: 'sm' | 'lg'
}

export default function GitHubSignInButton({
	size = 'sm',
}: GitHubSignInButtonProps) {
	// Only ever false in a local checkout without GitHub credentials, which
	// signs in through the devtools panel instead.
	if (!githubSignInConfigured) {
		return (
			<p className="text-sm text-gray-500 whitespace-nowrap">
				Sign in via Auth DevTools
			</p>
		)
	}

	return (
		<Button size={size} onClick={() => signInWithGitHub()}>
			Sign in with GitHub
		</Button>
	)
}
