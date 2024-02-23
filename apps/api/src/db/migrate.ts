import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from '@/db'

async function runMigrations() {
  await migrate(db, { migrationsFolder: 'migrations' })
    .then(() => {
      console.log('Applied migrations! ✅')
      process.exit(0)
    })
    .catch(err => {
      console.error('Migration failed! ❌')
      console.error(err)
    })
}

runMigrations()
