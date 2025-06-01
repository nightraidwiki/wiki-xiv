<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
        <div class="flex gap-4">
          <NuxtLink 
            to="/admin/articles/new"
            class="button button-primary"
          >
            New Article
          </NuxtLink>
          <button
            @click="handleLogout"
            class="button button-danger"
          >
            Logout
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Stats card -->
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 class="text-xl font-semibold mb-4">Welcome</h3>
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
    console.error('Error during logout:', error)
  }
}
</script> 