import type { GroupedCollabs } from '@/types/GroupedCollabs'
import { groupedProfilesQuery, type Projects, type TasksWithProjects } from '@/utils/supaQueries'

export function useCollabs() {
  const groupedCollabs = ref<GroupedCollabs>({})

  async function getProfilesByIds(userIds: string[]) {
    const { data, error } = await groupedProfilesQuery(userIds)

    if (error || !data) {
      return []
    }

    return data
  }

  async function getGroupedCollabs(items: Projects | TasksWithProjects) {
    const filteredItems = items.filter((item) => item.collaborators.length)

    const promises = filteredItems.map((item) => getProfilesByIds(item.collaborators))

    const results = await Promise.all(promises)

    filteredItems.forEach((item, index) => {
      groupedCollabs.value[item.id] = results[index]
    })
  }

  return {
    groupedCollabs,
    getProfilesByIds,
    getGroupedCollabs,
  }
}
