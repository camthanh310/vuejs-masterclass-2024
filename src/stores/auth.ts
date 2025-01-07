import type { Tables } from '@database/types'
import type { Session, User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<User | null>(null)
  const profile = ref<Tables<'profiles'> | null>(null)

  function setAuth(userSession: Session | null = null) {
    if (!userSession) {
      user.value = null
      return
    }

    user.value = userSession.user
  }

  return {
    user,
    profile,
    setAuth,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
