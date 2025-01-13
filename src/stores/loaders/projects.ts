import { projectsQuery, type Projects } from '@/utils/supaQueries'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)

  async function getProjects() {
    if (projects.value?.length) {
      return
    }

    const { data, error, status } = await projectsQuery

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }

    projects.value = data
  }

  return {
    projects,
    getProjects,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
}
