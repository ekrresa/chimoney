import express, { type Express } from 'express'

export const createServer = (): Express => {
  const app = express()

  return app
}
