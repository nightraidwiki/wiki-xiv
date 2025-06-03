<template>
  <div class="min-vh-100 bg-dark text-light">
    <div class="container py-4">
      <!-- Header -->
      <header class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-primary">Admin Dashboard</h1>
        <div class="d-flex gap-2">
          <NuxtLink 
            to="/admin/articles/new"
            class="btn btn-primary"
          >
            <i class="bi bi-plus-circle me-1"></i> New Article
          </NuxtLink>
          <NuxtLink 
            to="/admin/categories/new"
            class="btn btn-primary"
          >
            <i class="bi bi-plus-circle me-1"></i> New Category
          </NuxtLink>          <button
            @click="handleLogout"
            class="btn btn-outline-danger"
          >
            <i class="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <div class="row g-4">
        <!-- Welcome Card -->
        <div class="col-12">
          <div class="card bg-dark-subtle">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0 me-3">
                  <div class="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <i class="bi bi-person-circle text-primary fs-2"></i>
                  </div>
                </div>
                <div>
                  <h2 class="h5 mb-1">Welcome back!</h2>
                  <p class="mb-0 text-muted">{{ currentUser?.email || 'Administrator' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h6 mb-0">Total Articles</h3>
                <div class="bg-primary bg-opacity-10 p-2 rounded">
                  <i class="bi bi-file-earmark-text text-primary"></i>
                </div>
              </div>
              <p class="h2 mb-0">0</p>
              <small class="text-muted">0% from last month</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h6 mb-0">Categories</h3>
                <div class="bg-success bg-opacity-10 p-2 rounded">
                  <i class="bi bi-tags text-success"></i>
                </div>
              </div>
              <p class="h2 mb-0">0</p>
              <small class="text-muted">0% from last month</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h6 mb-0">Active Users</h3>
                <div class="bg-info bg-opacity-10 p-2 rounded">
                  <i class="bi bi-people text-info"></i>
                </div>
              </div>
              <p class="h2 mb-0">1</p>
              <small class="text-muted">You</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref({
  email: 'admin@example.com' // Valeur par défaut
})

// Fonction de déconnexion
async function handleLogout() {
  try {
    // Ici, vous devriez appeler votre service de déconnexion
    // Par exemple: await authService.logout()
    
    // Redirection vers la page d'accueil
    await router.push('/')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Récupération des informations de l'utilisateur
onMounted(() => {
  // Ici, vous devriez récupérer les informations de l'utilisateur connecté
  // Par exemple: currentUser.value = await authService.getCurrentUser()
})
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.bg-dark-subtle {
  background-color: #2c3034 !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>