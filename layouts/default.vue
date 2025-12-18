<template>
  <div class="layout">
    <!-- Navigation -->
    <nav class="nav">
      <div class="container">
        <div class="flex items-center justify-content-between nav-content">
          <!-- Logo + Left Nav -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="logo-text-nav">
              <span class="wiki">Wiki</span>
              <span class="xiv">XIV</span>
            </NuxtLink>
            <!-- Desktop Links -->
            <div class="hidden-mobile flex items-center gap-4">
              <NuxtLink to="/articles" class="btn-article">
                Articles
              </NuxtLink>
              <NuxtLink to="/repos" class="btn-article">
                Repos
              </NuxtLink>
            </div>
          </div>

          <!-- Navigation Links & Mobile Toggle -->
          <div class="flex gap-4 items-center">
            <!-- Desktop Dashboard -->
            <div class="hidden-mobile">
              <NuxtLink
                v-if="currentUser"
                to="/admin"
                class="btn btn-primary"
              >
                Dashboard
              </NuxtLink>
            </div>

            <!-- Mobile Burger Button -->
            <button class="burger-btn hidden-desktop" @click="isMenuOpen = !isMenuOpen" aria-label="Menu">
              <i class="bi" :class="isMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-fade">
        <div v-if="isMenuOpen" class="mobile-menu">
          <div class="container flex flex-col gap-2">
            <NuxtLink to="/articles" class="mobile-link" @click="isMenuOpen = false">
              Articles
            </NuxtLink>
            <NuxtLink to="/repos" class="mobile-link" @click="isMenuOpen = false">
              Repos
            </NuxtLink>
            <div v-if="currentUser" class="border-t border-gray-700 my-2 pt-2">
              <NuxtLink
                to="/admin"
                class="mobile-link text-primary"
                @click="isMenuOpen = false"
              >
                Dashboard
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
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
const isMenuOpen = ref(false)

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
  supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
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

.logo-text-nav {
  font-size: 1.5rem;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: -1px;
  text-transform: uppercase;
  display: flex;
  gap: 0.25rem;
}

.logo-text-nav .wiki {
  color: white;
}

.logo-text-nav .xiv {
  background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo-text-nav:hover {
  opacity: 0.8;
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
  color: white;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.btn-article:hover {
  background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: translateY(-1px);
}

.btn-article::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #60a5fa, #a855f7);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.btn-article:hover::after {
  width: 80%;
}

/* Mobile Menu Styles */
.burger-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu {
  background-color: #1a1a1a;
  border-top: 1px solid rgba(75, 85, 99, 0.5);
  padding: 1rem 0;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.mobile-link {
  display: block;
  padding: 0.75rem 1rem;
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
  border-radius: 0.375rem;
  margin: 0 1rem;
  transition: background-color 0.2s;
}

.mobile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.mobile-link.text-primary {
  color: #60a5fa;
}

.border-t {
  border-top: 1px solid;
}

.border-gray-700 {
  border-color: #374151;
}

.pt-2 {
  padding-top: 0.5rem;
}

.my-2 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.flex-col {
  flex-direction: column;
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .hidden-mobile {
    display: none !important;
  }
}

@media (min-width: 769px) {
  .hidden-desktop {
    display: none !important;
  }
}

/* Slide Fade Transition for Mobile Menu */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>