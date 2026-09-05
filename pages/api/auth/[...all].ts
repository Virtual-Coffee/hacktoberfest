import { toNodeHandler } from 'better-auth/node'
import { auth } from '@/lib/auth'

// Better Auth reads the raw request stream itself, so Next must not consume it
// first. This applies to THIS route only -- the form routes under
// pages/api/forms still rely on Next's parsed req.body.
//
// Anything that reads `req` before the handler (middleware, logging) will make
// OAuth hang rather than fail loudly, so keep this file as small as it is.
export const config = { api: { bodyParser: false } }

export default toNodeHandler(auth.handler)
