import { supabase } from '@/lib/supabaseClient'
import type { LoginForm, RegisterForm } from '@/types/AuthForm'

export async function register(formData: RegisterForm) {
  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return console.log(error)
  }

  if (data.user) {
    const { error } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: formData.username,
      full_name: formData.firstName.concat(' ', formData.lastName),
    })

    if (error) {
      console.log('Profiles err: ', error)
    }
  }
  return true
}

export async function login(formData: LoginForm) {
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  return { error }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return console.log(error)
  }

  return true
}