<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h1 class="h3 mb-3 text-center">Admin Login</h1>
            <p class="text-muted text-center mb-4">Access your administration area</p>

            <form @submit.prevent="handleLogin" class="needs-validation" novalidate>
              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control form-control-lg"
                  placeholder="your@email.com"
                  required
                >
                <div class="invalid-feedback">
                  Please enter a valid email address.
                </div>
              </div>

              <!-- Password -->
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control form-control-lg"
                  placeholder="••••••••"
                  required
                >
                <div class="invalid-feedback">
                  Please enter your password.
                </div>
              </div>


              <!-- Error message -->
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>


              <!-- Login button -->
              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 py-2"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span v-else>Login</span>
              </button>


              <!-- Back link -->
              <div class="text-center mt-3">
                <NuxtLink to="/" class="text-decoration-none">
                  ← Back to Home
                </NuxtLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Fonction de connexion temporaire - À remplacer par votre logique d'authentification
async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    
    // Exemple de validation côté client
    if (!email.value || !email.value.includes('@')) {
      error.value = 'Please enter a valid email address.'
      return
    }
    
    if (!password.value) {
      error.value = 'Please enter your password.'
      return
    }
    
    // Ici, vous devriez appeler votre service d'authentification
    // Par exemple: const { user } = await authService.login(email.value, password.value)
    
    // Simulation de délai pour le chargement
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirection après connexion réussie
    await router.push('/admin')
    
  } catch (e: any) {
    error.value = e.message || 'An error occurred during login.'
  } finally {
    loading.value = false
  }
}
</script> 