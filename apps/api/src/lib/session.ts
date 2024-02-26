import { createNamespace } from 'cls-hooked'

// This module sets up a session to keep info about a loggedIn user
// throughout the lifetime of a request
export const session = createNamespace('request-session')
const REQUEST_USER = 'requestUser'

export function setRequestUserId(payload: string) {
  session.set(REQUEST_USER, payload)
}

export function getRequestUserId(): string | undefined {
  return session.get(REQUEST_USER)
}
