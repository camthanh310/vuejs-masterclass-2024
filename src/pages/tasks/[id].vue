<script setup lang="ts">
import { taskQuery, type Task } from '@/utils/supaQueries'

const route = useRoute('/tasks/[id]')

const task = ref<Task | null>(null)

watch(
  () => task.value?.name,
  () => (usePageStore().pageData.title = `Task ${task.value?.name || ''}`),
)

async function getTask() {
  const { data, error } = await taskQuery(route.params.id)

  if (error) {
    console.log(error)
  }

  task.value = data
}

await getTask()
</script>

<template>
  <<template>
    <Table v-if="task">
      <TableRow>
        <TableHead> Name </TableHead>
        <TableCell> {{ task.name }} </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Description </TableHead>
        <TableCell>
          {{ task.description }}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Assignee </TableHead>
        <TableCell>Lorem ipsum</TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Project </TableHead>
        <TableCell> {{ task.projects?.name }} </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Status </TableHead>
        <TableCell>{{ task.status }}</TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Collaborators </TableHead>
        <TableCell>
          <div class="flex">
            <Avatar
              class="-mr-4 transition-transform border border-primary hover:scale-110"
              v-for="collab in task.collaborators"
              :key="collab"
            >
              <RouterLink class="flex items-center justify-center w-full h-full" to="">
                <AvatarImage src="" alt="" />
                <AvatarFallback> </AvatarFallback>
              </RouterLink>
            </Avatar>
          </div>
        </TableCell>
      </TableRow>
      <TableRow class="hover:bg-transparent">
        <TableHead class="pt-4 align-top"> Comments </TableHead>

        <TableCell>
          Comments cards goes in here..

          <div class="flex flex-col justify-between p-3 my-2 rounded-md bg-muted">
            <textarea
              placeholder="Add your comment.."
              class="w-full max-w-full p-3 overflow-y-auto prose-sm prose border rounded dark:prose-invert hover:border-muted bg-background border-muted"
            >
            </textarea>
            <div class="flex justify-between mt-3">
              <Button> Comment </Button>
              <div class="flex gap-4">
                <button variant="ghost" @click.prevent>
                  <iconify-icon icon="lucide:paperclip"></iconify-icon>
                  <span class="sr-only">Attach file</span>
                </button>
                <button variant="ghost" @click.prevent>
                  <iconify-icon icon="lucide:image-up"></iconify-icon>

                  <span class="sr-only">Upload image</span>
                </button>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </Table>
  </template>
</template>
