<script setup lang="ts">
const { slug } = useRoute('/projects/[slug]').params

const projectLoader = useProjectsStore()
const { project } = storeToRefs(projectLoader)
const { getProject, updateProject } = projectLoader

watch(
  () => project.value?.name,
  () => {
    usePageStore().pageData.title = `Project: ${project.value?.name || ''}`
  },
)

await getProject(slug)

const { getProfilesByIds } = useCollabs()

const collabs = project.value?.collaborators
  ? await getProfilesByIds(project.value.collaborators)
  : []
</script>

<template>
  <Table v-if="project">
    <TableRow>
      <TableHead> Name </TableHead>
      <TableCell>
        <AppInPlaceEditText v-model="project.name" @commit="updateProject" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Description </TableHead>
      <TableCell>
        <AppInPlaceEditTextarea
          class="h-20"
          v-model="project.description"
          @commit="updateProject"
        />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Status </TableHead>
      <TableCell>
        <AppInPlaceEditStatus v-model="project.status" @commit="updateProject" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Collaborators </TableHead>
      <TableCell>
        <div class="flex">
          <Avatar
            class="-mr-4 transition-transform border border-primary hover:scale-110"
            v-for="collab in collabs"
            :key="collab.id"
          >
            <RouterLink
              class="flex items-center justify-center w-full h-full"
              :to="{
                name: '/users/[username]',
                params: { username: collab.username },
              }"
            >
              <AvatarImage :src="collab.avatar_url || ''" alt="" />
              <AvatarFallback> </AvatarFallback>
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
  </Table>

  <section v-if="project" class="flex flex-col justify-between gap-5 mt-10 md:flex-row grow">
    <div class="flex-1">
      <h2>Tasks</h2>
      <div class="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Name </TableHead>
              <TableHead> Status </TableHead>
              <TableHead> Due Date </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="task in project.tasks" :key="task.id">
              <TableCell class="p-0">
                <RouterLink
                  class="block p-4 text-left hover:bg-muted"
                  :to="{
                    name: '/tasks/[id]',
                    params: { id: task.id },
                  }"
                >
                  {{ task.name }}
                </RouterLink>
              </TableCell>
              <TableCell>
                <AppInPlaceEditStatus readonly :model-value="task.status" />
              </TableCell>
              <TableCell> {{ task.status }} </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
    <div class="flex-1">
      <h2>Documents</h2>
      <div class="table-container">
        <p class="px-4 py-3 text-sm font-semibold text-muted-foreground">
          This project doesn't have documents yet...
        </p>
        <!-- <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Name </TableHead>
              <TableHead> Visibility </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell> Lorem ipsum dolor sit amet. </TableCell>
              <TableCell> Private </TableCell>
            </TableRow>
          </TableBody>
        </Table> -->
      </div>
    </div>
  </section>
</template>

<style>
th {
  @apply w-[100px];
}

h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md bg-slate-900 h-80;
}
</style>
