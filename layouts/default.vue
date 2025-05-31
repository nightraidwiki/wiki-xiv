<template>
  <div class="min-h-screen bg-gray-50">
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="font-bold text-xl">Wiki XIV</NuxtLink>
      </template>
      <template #right>
        <UButton
          v-if="!isLoggedIn"
          to="/auth/login"
          color="primary"
          variant="solid"
        >
          Se connecter
        </UButton>
        <UButton
          v-else
          to="/admin"
          color="primary"
          variant="solid"
        >
          Dashboard
        </UButton>
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
const isLoggedIn = ref(false) // À remplacer par la logique d'authentification
</script> 