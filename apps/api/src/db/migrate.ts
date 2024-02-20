import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from '@/db'

async function runMigrations() {
  await migrate(db, { migrationsFolder: 'drizzle' }).then(() => {
    console.log('Applied migrations...')
    process.exit(0)
  })
}

runMigrations()
