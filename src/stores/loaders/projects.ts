import { projectQuery, projectsQuery, type Project, type Projects } from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects>([])
  const project = ref<Project>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadProjects = useMemoize(async (key: string) => await projectsQuery)
  const loadProject = useMemoize(async (slug: string) => await projectQuery(slug))

  async function getProjects() {
    const { data, error, status } = await loadProjects('projects')

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }

    if (data) {
      projects.value = data
    }

    validateCache()
  }

  async function getProject(slug: string) {
    const { data, error, status } = await loadProject(slug)

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }

    if (data) {
      project.value = data
    }
  }

  function validateCache() {
    if (projects.value?.length) {
      projectsQuery.then(({ data, error }) => {
        if (JSON.stringify(projects.value) === JSON.stringify(data)) {
          //
        } else {
          loadProjects.delete('projects')
          if (!error && data) {
            projects.value = data
          }
        }
      })
    }
  }

  return {
    projects,
    project,
    getProjects,
    getProject,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
}
