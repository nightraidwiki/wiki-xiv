<template>
  <div class="form-container">
    <div class="form-card">
      <h1 class="form-title">Admin Login</h1>
      <p class="form-subtitle">Access your administration area</p>

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
            placeholder="your@email.com"
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label class="form-label">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="••••••••"
          />
        </div>

        <!-- Error message -->
        <div v-if="error" class="form-error">
          {{ error }}
        </div>

        <!-- Login button -->
        <button
          type="submit"
          class="form-button"
          :disabled="loading"
        >
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <!-- Back link -->
      <NuxtLink 
        to="/" 
        class="form-link"
      >
        Back to Home
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
      error.value = 'Login error'
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script> 