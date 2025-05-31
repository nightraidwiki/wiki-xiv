<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-blue-400">Tableau de bord Admin</h1>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
        >
          Déconnexion
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Carte de statistiques -->
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 class="text-xl font-semibold mb-4">Bienvenue</h3>
          <p class="text-gray-300">
            {{ currentUser?.email }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'

const router = useRouter()
const { signOut, getCurrentUser } = useSupabase()
const currentUser = ref(await getCurrentUser())

async function handleLogout() {
  try {
    await signOut()
    await router.push('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script> 