import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware(async (to) => {
  const { getCurrentUser } = useSupabase()

  try {
    const user = await getCurrentUser()
    if (!user && to.path.startsWith('/admin')) {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return navigateTo('/auth/login')
  }
}) 