/* eslint-env node */

import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SERVICE_ROLE_KEY)

const testingUserEmail = process.env.TESTING_USER_EMAIL

if (!testingUserEmail) {
  console.error('Have you forgot to add TESTING_USER_EMAIL to your .env file?')
  process.exit()
}
function logErrorAndExit(tableName, error) {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`,
  )

  process.exit()
}

function logStep(stepMessage) {
  console.log(stepMessage)
}

async function seedProjects(numEntries, userId) {
  logStep('Seeding projects...')
  const projects = []

  for (let index = 0; index < numEntries; index++) {
    const name = faker.lorem.words(3)
    projects.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      description: faker.lorem.paragraphs(2),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      collaborators: faker.helpers.arrayElements([userId]),
    })
  }

  const { data, error } = await supabase.from('projects').insert(projects).select('id')

  if (error) {
    return logErrorAndExit('Projects', error)
  }

  logStep('Projects seeded successfully.')

  return data
}

async function seedTasks(numEntries, projectsIds, userId) {
  logStep('Seeding tasks...')
  const tasks = []

  for (let i = 0; i < numEntries; i++) {
    tasks.push({
      name: faker.lorem.words(3),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      description: faker.lorem.paragraph(),
      due_date: faker.date.future(),
      profile_id: userId,
      project_id: faker.helpers.arrayElement(projectsIds),
      collaborators: faker.helpers.arrayElements([userId]),
    })
  }

  const { data, error } = await supabase.from('tasks').insert(tasks).select('id')

  if (error) {
    return logErrorAndExit('Tasks', error)
  }

  logStep('Tasks seeded successfully.')

  return data
}

async function seedDatabase(numEntriesPerTable) {
  let userId

  const testUserId = await PrimaryTestUserExists()

  if (!testUserId) {
    const primaryTestUserId = await createPrimaryTestUser()
    userId = primaryTestUserId
  } else {
    userId = testUserId
  }

  const projectsIds = (await seedProjects(numEntriesPerTable, userId)).map((project) => project.id)
  await seedTasks(numEntriesPerTable, projectsIds, userId)
}

async function PrimaryTestUserExists() {
  logStep('Checking if primary test user exists...')
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', 'testaccount1')
    .single()

  if (error) {
    console.log('Primary test user not found. Will create one.')
    return false
  }

  logStep('Primary test user is found.')
  return data?.id
}

async function createPrimaryTestUser() {
  logStep('Creating primary test user...')
  const firstName = 'Test'
  const lastName = 'Account'
  const userName = 'testaccount1'
  const email = testingUserEmail
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: 'password',
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: firstName + ' ' + lastName,
        username: userName,
      },
    },
  })

  if (error) {
    logErrorAndExit('Users', error)
  }

  if (data) {
    const userId = data.user.id
    await supabase.from('profiles').insert({
      id: userId,
      full_name: firstName + ' ' + lastName,
      username: userName,
      bio: 'The main testing account',
      avatar_url: `https://i.pravatar.cc/150?u=${data.user.id}`,
    })

    logStep('Primary test user created successfully.')
    return userId
  }
}

const numEntriesPerTable = 10

seedDatabase(numEntriesPerTable)
