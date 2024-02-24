import 'dotenv/config'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { router } from './routes'

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
    .use('/api', router)
    .use((req, res) => {
      res.status(404).send('Not found')
    })
  // Add global error handler
  // .use((err, req, res, next) => {
  //   console.error(err)
  //   res.status(500).send('Internal server error')
  // })

  return app
}
