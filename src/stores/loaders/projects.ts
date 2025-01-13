import { projectsQuery, type Projects } from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)
  const loadProjects = useMemoize(async (key: string) => await projectsQuery)

  async function getProjects() {
    const { data, error, status } = await loadProjects('projects')

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }

    projects.value = data

    validateCache()
  }

  function validateCache() {
    if (projects.value?.length) {
      projectsQuery.then(({ data }) => {
        if (JSON.stringify(projects.value) === JSON.stringify(data)) {
          console.log('Cached and fresh data matched!')
        } else {
          console.log('Something has changed!')
          loadProjects.delete('projects')
        }
      })
    }
  }

  return {
    projects,
    getProjects,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
}
