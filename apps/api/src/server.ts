import 'dotenv/config'
import 'express-async-errors'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { router } from '@/routes'
import { globalErrorHandler } from '@/lib/error'

export const createServer = (): Express => {
  const app = express()

  app
    .disable('x-powered-by')
    .use(cors())
    .use(morgan('dev'))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .get('/', (_req, res) => {
      res.send('Hello World!')
    })
    .use('/api', router)
    .use((req, res) => {
      res.status(404).json({ message: 'Route not found' })
    })
    .use(globalErrorHandler)

  return app
}
