import { ErrorAlert } from '@/components/Alert'
import Button from '@/components/Button'

/**
 * What an admin page shows when a query fails outright.
 *
 * Only a real failure reaches this: util/api.ts turns a 403 into
 * AdminAccessError, which useAdminAccess handles, and returns null for a 404
 * so the pages keep their own "not found" copy. What is left is the server or
 * the network, so it is worth offering another go -- admin queries set
 * `retry: false`, which means nothing tries again unless the person asks.
 *
 * Says explicitly that access is not the problem. The dashboard's other
 * failure state is a revoked admin, and an unqualified error here would read
 * as that.
 */
export default function AdminError({ onRetry }: { onRetry: () => void }) {
	return (
		<ErrorAlert title="Could not load this data">
			<p>
				Something went wrong on our end -- this is not a permissions problem,
				your admin access is fine.
			</p>
			<Button type="button" onClick={onRetry} size="sm" color="utility">
				Try again
			</Button>
		</ErrorAlert>
	)
}
