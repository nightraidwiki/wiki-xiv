<template>
  <div class="layout">
    <!-- Navigation -->
    <nav class="nav">
      <div class="container">
        <div class="flex items-center justify-content-between nav-content">
          <!-- Logo + Left Nav -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="logo">
              <img src="/public/logo_header.png" alt="Wiki XIV" class="" style="height: 60px;padding:10px 0;">
            </NuxtLink>
            <NuxtLink to="/articles" class="btn-article">
              Articles
            </NuxtLink>
            <NuxtLink to="/repos" class="btn-article">
              Repos
            </NuxtLink>
          </div>

          <!-- Navigation Links -->
          <div class="flex gap-4 items-center">
            <NuxtLink
              v-if="currentUser"
              to="/admin"
              class="btn btn-primary"
            >
              Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main container">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container text-center">
        <p>&copy; {{ new Date().getFullYear() }} Wiki XIV. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const currentUser = ref(null)

onMounted(async () => {
  const { getCurrentUser, supabase } = useSupabase()
  // Attendre explicitement la restauration de session côté client
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const user = await getCurrentUser()
    currentUser.value = user
  } else {
    currentUser.value = null
  }
  // Ecoute la déconnexion/reconnexion
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session && session.user) {
      currentUser.value = session.user
    } else {
      currentUser.value = null
    }
  })
})
</script>

<style>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  background-color: #121212;
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  width: 100%;
}

.nav-content {
  height: 4rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #60a5fa;
  transition: color 0.2s;
}

.logo:hover {
  color: #93c5fd;
  text-decoration: none;
}

.main {
  padding: 2rem 1rem;
  flex: 1;
  margin-top: 80px;
}

.footer {
  background-color: var(--color-gray-850);
  border-top: 1px solid rgba(75, 85, 99, 0.5);
  padding: 2rem 0;
  color: #9ca3af;
  margin-top: auto;
}

/* Animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Styles des scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: var(--color-gray-850);
}

::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

.btn-article {
  color: #ea00ff;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.2s;
}

.btn-article:hover {
  color: #ff80ff;
}
</style>