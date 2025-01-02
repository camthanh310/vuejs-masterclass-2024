import type { ExtendedPostgrestError, CustomError } from '@/types/Error'
import type { PostgrestError } from '@supabase/supabase-js'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<CustomError | ExtendedPostgrestError | null>(null)

  function setError({
    error,
    customCode,
  }: {
    error: string | PostgrestError | Error
    customCode?: number
  }) {
    if (typeof error === 'string' || error instanceof Error) {
      activeError.value = typeof error === 'string' ? Error(error) : error
      activeError.value.customCode = customCode ?? 500
      return
    }

    activeError.value = error
    ;(activeError.value as ExtendedPostgrestError).statusCode = customCode ?? 500
  }

  return {
    activeError,
    setError,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
