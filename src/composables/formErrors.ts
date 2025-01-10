import type { AuthError } from '@supabase/supabase-js'

export function useFormErrors() {
  const serverError = ref('')

  function handleServerError(error: AuthError) {
    serverError.value =
      error.message === 'Invalid login credentials' ? 'Incorrect email or password' : error.message
  }

  return {
    serverError,
    handleServerError,
  }
}
