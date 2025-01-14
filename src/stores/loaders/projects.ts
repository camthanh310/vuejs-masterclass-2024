import {
  projectQuery,
  projectsQuery,
  updateProjectQuery,
  type Project,
  type Projects,
} from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)
  const project = ref<Project | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadProjects = useMemoize(async (key: string) => await projectsQuery)
  const loadProject = useMemoize(async (slug: string) => await projectQuery(slug))

  interface ValidateCacheParams {
    ref: typeof projects | typeof project
    query: typeof projectsQuery | typeof projectQuery
    key: string
    loaderFn: typeof loadProjects | typeof loadProject
  }

  async function getProjects() {
    projects.value = null

    const { data, error, status } = await loadProjects('projects')

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }

    if (data) {
      projects.value = data
    }

    validateCache({
      ref: projects,
      query: projectQuery,
      key: 'projects',
      loaderFn: loadProjects,
    })
  }

  async function getProject(slug: string) {
    project.value = null

    const { data, error, status } = await loadProject(slug)

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }

    if (data) {
      project.value = data
    }

    validateCache({
      ref: project,
      query: projectQuery,
      key: slug,
      loaderFn: loadProject,
    })
  }

  async function updateProject() {
    if (!project.value) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tasks, id, ...projectProperties } = project.value

    await updateProjectQuery(projectProperties, project.value.id)
  }

  function validateCache({ ref, query, key, loaderFn }: ValidateCacheParams) {
    if (ref.value) {
      const finalQuery = typeof query === 'function' ? query(key) : query

      finalQuery.then(({ data, error }) => {
        if (JSON.stringify(projects.value) === JSON.stringify(data)) {
          //
        } else {
          loaderFn.delete(key)
          if (!error && data) {
            ref.value = data
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
    updateProject,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
}
