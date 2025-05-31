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

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

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
import { useSupabase } from '~/composables/useSupabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const { signIn } = useSupabase()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await signIn(email.value, password.value)
    // Redirection vers le dashboard après connexion réussie
    router.push('/admin')
  } catch (e: any) {
    error.value = e.message || 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}
</script> 