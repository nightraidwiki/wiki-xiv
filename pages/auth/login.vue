<template>
  <div class="form-container">
    <div class="form-card">
      <h1 class="form-title">Connexion Admin</h1>
      <p class="form-subtitle">Accédez à votre espace d'administration</p>

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="form-group">
          <label class="form-label">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="votre@email.com"
          />
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label class="form-label">
            Mot de passe
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="••••••••"
          />
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="form-error">
          {{ error }}
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          class="form-button"
          :disabled="loading"
        >
          <span v-if="loading">Connexion en cours...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <!-- Lien de retour -->
      <NuxtLink 
        to="/" 
        class="form-link"
      >
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const { signIn } = useSupabase()

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    
    const { user } = await signIn(email.value, password.value)
    if (user) {
      await router.push('/admin')
    } else {
      error.value = 'Erreur lors de la connexion'
    }
  } catch (e: any) {
    error.value = e.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script> 