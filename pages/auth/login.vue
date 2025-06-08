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

import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    // Validation côté client
    if (!email.value || !email.value.includes('@')) {
      error.value = 'Please enter a valid email address.'
      return
    }
    if (!password.value) {
      error.value = 'Please enter your password.'
      return
    }
    // Authentification réelle avec Supabase
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (loginError) {
      error.value = loginError.message || 'Invalid credentials.'
      return
    }
    // Redirection si succès
    await router.push('/admin')
  } catch (e: any) {
    error.value = e.message || 'An error occurred during login.'
  } finally {
    loading.value = false
  }
}
</script> 