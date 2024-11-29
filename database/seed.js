/* eslint-env node */

import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SERVICE_ROLE_KEY)

function logErrorAndExit(tableName, error) {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`,
  )

  process.exit()
}

function logStep(stepMessage) {
  console.log(stepMessage)
}

async function seedProjects(numEntries) {
  logStep('Seeding projects...')
  const projects = []

  for (let index = 0; index < numEntries; index++) {
    const name = faker.lorem.words(3)
    projects.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      collaborators: faker.helpers.arrayElements([1, 2, 3]),
    })
  }

  const { data, error } = await supabase.from('projects').insert(projects).select('id')

  if (error) {
    return logErrorAndExit('Projects', error)
  }

  logStep('Projects seeded successfully.')

  return data
}

async function seedDatabase(numEntriesPerTable) {
  await seedProjects(numEntriesPerTable)
}

const numEntriesPerTable = 10

seedDatabase(numEntriesPerTable)
