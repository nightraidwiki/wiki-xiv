<template>
  <div class="layout">
    <!-- Navigation -->
    <nav class="nav">
      <div class="container">
        <div class="flex items-center justify-content-between nav-content">
          <!-- Logo -->
          <NuxtLink to="/" class="logo">
            Wiki XIV
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="flex gap-4">
            <NuxtLink 
              to="/auth/login"
              class="btn btn-primary"
            >
              Connexion Admin
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
        <p>&copy; {{ new Date().getFullYear() }} Wiki XIV. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<style>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  background-color: var(--color-gray-850);
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
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
</style> 