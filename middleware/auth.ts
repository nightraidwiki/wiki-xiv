import { useSupabase } from '~/composables/useSupabase'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  const { getCurrentUser, supabase } = useSupabase()
  try {
    // Attendre explicitement la restauration de session côté client
    const { data: { session } } = await supabase.auth.getSession()
    if (!session && to.path.startsWith('/admin')) {
      return navigateTo('/auth/login')
    }
    const user = await getCurrentUser()
    if (!user && to.path.startsWith('/admin')) {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return navigateTo('/auth/login')
  }
})