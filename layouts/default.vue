<template>
  <div class="min-h-screen bg-gray-50">
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="font-bold text-xl">Wiki XIV</NuxtLink>
      </template>
      <template #right>
        <UButton
          v-if="!user"
          to="/auth/login"
          color="primary"
          variant="solid"
        >
          Se connecter
        </UButton>
        <div v-else class="flex items-center gap-4">
          <UButton
            to="/admin"
            color="primary"
            variant="solid"
          >
            Dashboard
          </UButton>
          <UButton
            color="primary"
            variant="soft"
            @click="handleLogout"
          >
            Déconnexion
          </UButton>
        </div>
      </template>
    </UHeader>

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-gray-100 border-t py-8 mt-auto">
      <div class="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; {{ new Date().getFullYear() }} Wiki XIV. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import type { User } from '@supabase/supabase-js'

const router = useRouter()
const user = ref<User | null>(null)
const { getCurrentUser, signOut } = useSupabase()

// Vérifier l'état de connexion au chargement
onMounted(async () => {
  try {
    user.value = await getCurrentUser()
  } catch (error) {
    console.error('Error checking auth state:', error)
  }
})

const handleLogout = async () => {
  try {
    await signOut()
    user.value = null
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script> 