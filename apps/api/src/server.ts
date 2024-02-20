import 'dotenv/config'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'

export const createServer = (): Express => {
  const app = express()

  app
    .disable('x-powered-by')
    .use(cors())
    .use(morgan('dev'))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .get('/', (req, res) => {
      res.send('Hello World!')
    })

  return app
}
