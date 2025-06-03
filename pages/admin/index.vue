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
          <div class="card h-100 cursor-pointer" @click="toggleArticlesTable">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h6 mb-0">Total Articles</h3>
                <div class="bg-primary bg-opacity-10 p-2 rounded">
                  <i class="bi bi-file-earmark-text text-primary"></i>
                </div>
              </div>
              <p class="h2 mb-0">{{ articles.length }}</p>
              <small class="text-muted">Click to view all articles</small>
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

      <!-- Articles Table -->
      <div v-if="showArticlesTable" class="mt-4">
        <div class="card shadow-sm">
          <div class="card-header bg-dark-subtle d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Articles</h2>
            <div>
              <button 
                @click="refreshArticles" 
                class="btn btn-sm btn-outline-primary me-2"
                :disabled="loading"
              >
                <i class="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
              <button @click="showArticlesTable = false" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center p-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 mb-0">Loading articles...</p>
            </div>
            <div v-else-if="error" class="alert alert-danger m-3">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ error }}
            </div>
            <div v-else-if="articles.length === 0" class="text-center p-4">
              <i class="bi bi-journal-x fs-1 text-muted mb-2"></i>
              <p class="mb-0">No articles found</p>
              <NuxtLink to="/admin/articles/new" class="btn btn-primary btn-sm mt-3">
                <i class="bi bi-plus-circle me-1"></i> Create your first article
              </NuxtLink>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover table-dark mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="article in articles" :key="article.id">
                    <td>{{ article.title }}</td>
                    <td>{{ article.category?.name || 'Uncategorized' }}</td>
                    <td>
                      <span 
                        class="badge" 
                        :class="article.visible ? 'bg-success' : 'bg-secondary'"
                      >
                        {{ article.visible ? 'Published' : 'Draft' }}
                      </span>
                    </td>
                    <td>{{ formatDate(article.created_at) }}</td>
                    <td>{{ formatDate(article.updated_at) }}</td>
                    <td class="text-end">
                      <div class="btn-group">
                        <NuxtLink 
                          :to="`/admin/articles/new?id=${article.id}`" 
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-pencil"></i>
                        </NuxtLink>
                        <button 
                          @click="confirmDelete(article)" 
                          class="btn btn-sm btn-outline-danger"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { useSupabase } from '../../composables/useSupabase'

const router = useRouter()
const { getCurrentUser, getArticles, deleteArticle, signOut } = useSupabase()

// Variables d'état
const currentUser = ref<any>(null)
const articles = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showArticlesTable = ref(false)

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Fonction pour basculer l'affichage du tableau des articles
const toggleArticlesTable = async () => {
  showArticlesTable.value = !showArticlesTable.value
  if (showArticlesTable.value && articles.value.length === 0) {
    await refreshArticles()
  }
}

// Fonction pour rafraîchir la liste des articles
const refreshArticles = async () => {
  loading.value = true
  error.value = null
  
  try {
    articles.value = await getArticles() || []
  } catch (err: any) {
    console.error('Error loading articles:', err)
    error.value = err.message || 'Failed to load articles'
  } finally {
    loading.value = false
  }
}

// Fonction pour confirmer et supprimer un article
const confirmDelete = async (article: any) => {
  if (!confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
    return
  }
  
  loading.value = true
  try {
    await deleteArticle(article.id)
    await refreshArticles()
  } catch (err: any) {
    console.error('Error deleting article:', err)
    alert(`Failed to delete article: ${err.message}`)
  } finally {
    loading.value = false
  }
}

// Fonction de déconnexion
async function handleLogout() {
  try {
    await signOut()
    await router.push('/')
  } catch (error: any) {
    console.error('Error during logout:', error)
  }
}

// Initialisation
onMounted(async () => {
  try {
    // Récupérer l'utilisateur connecté
    const user = await getCurrentUser()
    if (user) {
      currentUser.value = { email: user.email || 'Utilisateur connecté' }
    } else {
      router.push('/auth/login')
      return
    }
    
    // Charger les articles
    await refreshArticles()
  } catch (err: any) {
    console.error('Error initializing dashboard:', err)
  }
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