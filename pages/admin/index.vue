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
          </NuxtLink>
          <NuxtLink 
            to="/admin/tags/new"
            class="btn btn-primary"
          >
            <i class="bi bi-plus-circle me-1"></i> New Tag
          </NuxtLink>
          <button
            @click="showBannerModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus-circle me-1"></i> Nouvelle image banner
          </button>
          <button
            @click="handleLogout"
            class="btn btn-outline-danger"
          >
            <i class="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </header>

      <!-- Modal Upload Banner -->
      <div v-if="showBannerModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content bg-dark text-light">
            <div class="modal-header">
              <h5 class="modal-title">Uploader une image banner</h5>
              <button type="button" class="btn-close btn-close-white" @click="showBannerModal = false" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleBannerUpload">
                <div class="mb-3">
                  <input type="file" accept="image/*" @change="onBannerFileChange" ref="bannerInput" class="form-control" :disabled="bannerUploading" />
                </div>
                <div v-if="bannerPreview" class="mb-3">
                  <img :src="bannerPreview" alt="Aperçu" style="max-width: 300px; max-height: 150px; border-radius: 8px;" />
                </div>
                <div class="d-flex align-items-center gap-2">
                  <button type="submit" class="btn btn-success" :disabled="bannerUploading || !bannerFile">Uploader</button>
                  <span v-if="bannerUploading" class="spinner-border spinner-border-sm text-success"></span>
                  <span v-if="bannerError" class="text-danger ms-2">{{ bannerError }}</span>
                  <span v-if="bannerSuccess" class="text-success ms-2">Image uploadée !</span>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showBannerModal = false">Fermer</button>
            </div>
          </div>
        </div>
      </div>

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
          <div class="card h-100 cursor-pointer" @click="onClickArticlesCard">
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
        <!-- Total Tags Card -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 cursor-pointer" @click="onClickTagsCard">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h6 mb-0">Total Tags</h3>
                <div class="bg-warning bg-opacity-10 p-2 rounded">
                  <i class="bi bi-tag text-warning"></i>
                </div>
              </div>
              <p class="h2 mb-0">{{ tags.length }}</p>
              <small class="text-muted">Click to view all tags</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card h-100 cursor-pointer" @click="onClickCategoriesCard">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h6 mb-0">Categories</h3>
                <div class="bg-success bg-opacity-10 p-2 rounded">
                  <i class="bi bi-tags text-success"></i>
                </div>
              </div>
              <p class="h2 mb-0">{{ categories.length }}</p>
              <small class="text-muted">Click to view all categories</small>
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

      <!-- Categories Table -->
      <div v-if="showCategoriesTable" class="mt-4">
        <div class="card shadow-sm">
          <div class="card-header bg-dark-subtle d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Categories</h2>
            <NuxtLink to="/admin/categories/new" class="btn btn-primary btn-sm">
              <i class="bi bi-plus-circle me-1"></i> Nouvelle catégorie
            </NuxtLink>
          </div>
          <div class="card-body p-0">
            <div v-if="loadingCategories" class="text-center p-4">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 mb-0">Chargement des catégories...</p>
            </div>
            <div v-else-if="categoriesError" class="alert alert-danger m-3">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ categoriesError }}
            </div>
            <div v-else-if="categories.length === 0" class="text-center p-4">
              <i class="bi bi-tags-x fs-1 text-muted mb-2"></i>
              <p class="mb-0">Aucune catégorie pour le moment</p>
              <NuxtLink to="/admin/categories/new" class="btn btn-primary btn-sm mt-3">
                <i class="bi bi-plus-circle me-1"></i> Créer une catégorie
              </NuxtLink>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover table-dark mb-0">
                <thead>
                  <tr>
                    <th>Nom</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cat in categories" :key="cat.id">
                    <td>{{ cat.name }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

<!-- Tags Table -->
      <div v-if="showTagsTable" class="mt-4">
        <div class="card shadow-sm">
          <div class="card-header bg-dark-subtle d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Tags</h2>
            <NuxtLink to="/admin/tags/new" class="btn btn-primary btn-sm">
              <i class="bi bi-plus-circle me-1"></i> Nouveau tag
            </NuxtLink>
          </div>
          <div class="card-body p-0">
            <div v-if="loadingTags" class="text-center p-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 mb-0">Chargement des tags...</p>
            </div>
            <div v-else-if="tagsError" class="alert alert-danger m-3">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ tagsError }}
            </div>
            <div v-else-if="tags.length === 0" class="text-center p-4">
              <i class="bi bi-tag-x fs-1 text-muted mb-2"></i>
              <p class="mb-0">Aucun tag pour le moment</p>
              <NuxtLink to="/admin/tags/new" class="btn btn-primary btn-sm mt-3">
                <i class="bi bi-plus-circle me-1"></i> Créer un tag
              </NuxtLink>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover table-dark mb-0">
                <thead>
                  <tr>
                    <th>Nom</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tag in tags" :key="tag.id">
                    <td>{{ tag.name }}</td>
                  </tr>
                </tbody>
              </table>
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
              <div class="btn-group me-2">
                <button 
                  class="btn btn-sm" 
                  :class="visibilityFilter === null ? 'btn-primary' : 'btn-outline-primary'"
                  @click="setVisibilityFilter(null)"
                  :disabled="loading"
                >
                  All
                </button>
                <button 
                  class="btn btn-sm" 
                  :class="visibilityFilter === true ? 'btn-primary' : 'btn-outline-primary'"
                  @click="setVisibilityFilter(true)"
                  :disabled="loading"
                >
                  Published
                </button>
                <button 
                  class="btn btn-sm" 
                  :class="visibilityFilter === false ? 'btn-primary' : 'btn-outline-primary'"
                  @click="setVisibilityFilter(false)"
                  :disabled="loading"
                >
                  Drafts
                </button>
              </div>
              <button 
                @click="refreshArticles()" 
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
            <div v-else-if="filteredArticles.length === 0" class="text-center p-4">
              <i class="bi bi-journal-x fs-1 text-muted mb-2"></i>
              <p class="mb-0">
                {{ articles.length === 0 ? 'No articles found' : 'No articles match the selected filter' }}
              </p>
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
                  <tr v-for="article in filteredArticles" :key="article.id">
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
import { useSupabase } from '../../composables/useSupabase'
const { supabase } = useSupabase()

// --- Banner Upload Logic ---
const showBannerModal = ref(false)
const bannerFile = ref<File|null>(null)
const bannerPreview = ref<string|null>(null)
const bannerUploading = ref(false)
const bannerError = ref<string|null>(null)
const bannerSuccess = ref(false)
const bannerInput = ref<HTMLInputElement|null>(null)

function onBannerFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    bannerFile.value = input.files[0]
    bannerPreview.value = URL.createObjectURL(input.files[0])
    bannerError.value = null
    bannerSuccess.value = false
  }
}

async function handleBannerUpload() {
  if (!bannerFile.value) return
  bannerUploading.value = true
  bannerError.value = null
  bannerSuccess.value = false
  try {
    // 1. Upload to Supabase Storage (bucket: 'banners')
    const file = bannerFile.value
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage.from('banners').upload(fileName, file)
    if (uploadError) throw uploadError

    // 2. Get public URL
    const { data: publicUrlData } = supabase.storage.from('banners').getPublicUrl(fileName)
    const imageUrl = publicUrlData.publicUrl

    // 3. Insert into images_banner
    const { error: insertError } = await supabase.from('images_banner').insert([{ image: imageUrl }])
    if (insertError) throw insertError

    bannerSuccess.value = true
    bannerFile.value = null
    bannerPreview.value = null
    if (bannerInput.value) bannerInput.value.value = ''
    // Fermer le modal après succès
    setTimeout(() => {
      showBannerModal.value = false
      bannerSuccess.value = false
    }, 1200)
  } catch (err: any) {
    bannerError.value = err.message || 'Erreur lors de l\'upload'
  } finally {
    bannerUploading.value = false
  }
}

import { useRouter } from 'vue-router'

const router = useRouter()
const { getCurrentUser, getArticles, deleteArticle, signOut } = useSupabase()

// Variables d'état
const currentUser = ref<any>(null)
const articles = ref<any[]>([])
const filteredArticles = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showArticlesTable = ref(false)
const showTagsTable = ref(false)
const showCategoriesTable = ref(false)

const loadingCategories = ref(false)

function onClickArticlesCard() {
  showArticlesTable.value = true;
  showTagsTable.value = false;
  showCategoriesTable.value = false;
}

function onClickTagsCard() {
  showTagsTable.value = true;
  showArticlesTable.value = false;
  showCategoriesTable.value = false;
}

function onClickCategoriesCard() {
  showCategoriesTable.value = true;
  showArticlesTable.value = false;
  showTagsTable.value = false;
  refreshCategories();
}
const categoriesError = ref<string | null>(null)

const refreshCategories = async () => {
  loadingCategories.value = true
  categoriesError.value = null
  try {
    const { data, error: supabaseError } = await supabase
      .from('categories')
      .select('*')
    if (supabaseError) throw supabaseError
    categories.value = data || []
  } catch (err: any) {
    categoriesError.value = err.message || 'Erreur lors du chargement des catégories'
  } finally {
    loadingCategories.value = false
  }
}
const visibilityFilter = ref<boolean | null>(null)

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
  if (showArticlesTable.value) {
    if (articles.value.length === 0) {
      await refreshArticles()
    } else {
      applyFilters()
    }
  }
}

// Fonction pour définir le filtre de visibilité
const setVisibilityFilter = async (value: boolean | null) => {
  visibilityFilter.value = value
  // Recharger les articles à chaque changement de filtre
  await refreshArticles()
}

// Fonction pour appliquer les filtres aux articles
const applyFilters = () => {
  console.log('Début applyFilters - Filtre:', visibilityFilter.value);
  console.log('Articles avant filtrage:', articles.value.map(a => ({ id: a.id, title: a.title, visible: a.visible })));
  
  if (visibilityFilter.value === null) {
    // Tous les articles
    filteredArticles.value = [...articles.value];
  } else if (visibilityFilter.value === false) {
    // Articles brouillons (non publiés)
    filteredArticles.value = articles.value.filter(article => {
      // Pour les brouillons, on veut visible === false
      // Conversion explicite pour éviter les problèmes avec null/undefined
      return article.visible === false;
    });
  } else {
    // Articles publiés
    filteredArticles.value = articles.value.filter(article => {
      // Pour les publiés, on veut visible === true
      return article.visible === true;
    });
  }
  
  console.log('Articles après filtrage:', filteredArticles.value.map(a => ({ id: a.id, title: a.title, visible: a.visible })));
}

// Fonction pour rafraîchir la liste des articles
const refreshArticles = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Utiliser directement supabase pour avoir un contrôle complet sur la requête
    let query = supabase
      .from('articles')
      .select('*, category:categories(*)')
    
    // Appliquer le filtre de visibilité directement dans la requête SQL
    if (visibilityFilter.value === true) {
      // Articles publiés
      query = query.eq('visible', true)
    } else if (visibilityFilter.value === false) {
      // Articles brouillons - spécifiquement false (pas null ou undefined)
      query = query.eq('visible', false)
    }
    // Si visibilityFilter.value === null, on ne filtre pas et on récupère tous les articles
    
    // Tri par date de création
    query = query.order('created_at', { ascending: false })
    
    const { data, error: supabaseError } = await query
    
    if (supabaseError) throw supabaseError
    
    articles.value = data || []
    // Mettre à jour directement filteredArticles pour l'affichage
    filteredArticles.value = [...articles.value]
    
    console.log('Articles récupérés avec filtre:', visibilityFilter.value)
    console.log('Nombre d\'articles:', articles.value.length)
    console.log('Statuts de visibilité:', articles.value.map(a => a.visible))
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
// ----- TAGS -----
const tags = ref<any[]>([])
const loadingTags = ref(false)
const tagsError = ref<string | null>(null)

const refreshTags = async () => {
  loadingTags.value = true
  tagsError.value = null
  try {
    const { data, error: supabaseError } = await supabase
      .from('tags')
      .select('*')
    if (supabaseError) throw supabaseError
    tags.value = data || []
  } catch (err: any) {
    tagsError.value = err.message || 'Erreur lors du chargement des tags'
  } finally {
    loadingTags.value = false
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
    // Charger les tags
    await refreshTags()
    // NE PAS charger les catégories ici, uniquement au clic
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