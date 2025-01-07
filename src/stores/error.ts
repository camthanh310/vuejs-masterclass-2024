import type { ExtendedPostgrestError, CustomError } from '@/types/Error'
import type { PostgrestError } from '@supabase/supabase-js'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<CustomError | ExtendedPostgrestError | null>(null)
  const isCustomError = ref(false)

  function setError({
    error,
    customCode,
  }: {
    error: string | PostgrestError | Error
    customCode?: number
  }) {
    if (typeof error === 'string') {
      isCustomError.value = true
    }

    if (typeof error === 'string' || error instanceof Error) {
      activeError.value = typeof error === 'string' ? Error(error) : error
      activeError.value.customCode = customCode ?? 500
      return
    }

    activeError.value = error
    ;(activeError.value as ExtendedPostgrestError).statusCode = customCode ?? 500
  }

  function clearError() {
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    setError,
    isCustomError,
    clearError,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
