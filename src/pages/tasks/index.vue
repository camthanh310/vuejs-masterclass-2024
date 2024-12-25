<script lang="ts" setup>
import { tasksWithProjectsQuery, type TasksWithProjects } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/tasksColumns'

usePageStore().pageData.title = 'My Tasks'

const tasks = ref<TasksWithProjects | null>(null)
async function getTasks() {
  const { data, error } = await tasksWithProjectsQuery

  if (error) {
    console.log(error)
  }

  tasks.value = data
}

await getTasks()
</script>

<template>
  <DataTable v-if="tasks" :columns="columns" :data="tasks" />
</template>
