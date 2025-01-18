import type { QueryData } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import type { CreateNewTask } from '@/types/CreateNewForm'

export const tasksWithProjectsQuery = supabase.from('tasks').select(`
  *,
  projects (
    id,
    name,
    slug
  )`)

export const createNewTaskQuery = (newTask: CreateNewTask) => {
  return supabase.from('tasks').insert(newTask)
}

export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>

export const projectsQuery = supabase.from('projects').select()
export type Projects = QueryData<typeof projectsQuery>

export const projectQuery = (slug: string) =>
  supabase
    .from('projects')
    .select(
      `
        *,
        tasks (
          id,
          name,
          status,
          due_date
        )
      `,
    )
    .eq('slug', slug)
    .single()

export type Project = QueryData<ReturnType<typeof projectQuery>>

export const updateProjectQuery = (updatedProject = {}, id: number) => {
  return supabase.from('projects').update(updatedProject).eq('id', id)
}

export const taskQuery = (id: string) =>
  supabase
    .from('tasks')
    .select(
      `
        *,
        projects (
          id,
          name,
          slug
        )
      `,
    )
    .eq('id', id)
    .single()

export type Task = QueryData<ReturnType<typeof taskQuery>>

export const updateTaskQuery = (updatedTask = {}, id: number) => {
  return supabase.from('tasks').update(updatedTask).eq('id', id)
}

export const profileQuery = ({ column, value }: { column: string; value: string }) =>
  supabase.from('profiles').select().eq(column, value).single()

export const profilesQuery = supabase.from('profiles').select(`id, full_name`)

export const groupedProfilesQuery = (userIds: string[]) =>
  supabase.from('profiles').select('username, avatar_url, id, full_name').in('id', userIds)

export type Collabs = QueryData<ReturnType<typeof groupedProfilesQuery>>
