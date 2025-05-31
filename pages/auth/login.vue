<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold">Connexion</h1>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="email"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </UFormGroup>

        <UFormGroup label="Mot de passe" name="password">
          <UInput
            v-model="password"
            type="password"
            placeholder="Votre mot de passe"
            required
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          Se connecter
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    // TODO: Implémenter la logique de connexion avec Supabase
    console.log('Login attempt:', { email: email.value, password: password.value })
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script> 