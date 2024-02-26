import { createHash } from 'node:crypto'
import * as bcrypt from 'bcrypt'

export function hashPassword(password: string) {
  return bcrypt.hash(sha256(password), 10)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(sha256(password), hash)
}

function sha256(plaintext: string) {
  return createHash('sha256').update(plaintext).digest('base64')
}
