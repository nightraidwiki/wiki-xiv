<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-2">
          <i class="bi bi-folder me-2"></i>
          {{ categoryId ? 'Edit Category' : 'New Category' }}
        </h1>
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center me-3">
            <span 
              class="status-indicator me-2"
              :class="{ 'bg-success': user, 'bg-danger': !user }"
            ></span>
            <small class="text-muted">
              {{ user ? `Connected as ${user.email}` : 'Not connected' }}
            </small>
          </div>
        </div>
      </div>
      <div class="d-flex gap-2">
        <NuxtLink 
          to="/admin"
          class="btn btn-outline-secondary"
        >
          <i class="bi bi-arrow-left me-1"></i> Back
        </NuxtLink>
        <button 
          @click="handleSave"
          class="btn btn-primary"
          :disabled="isSaving"
        >
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          <i v-else class="bi me-1" :class="{ 'bi-save': categoryId, 'bi-plus-circle': !categoryId }"></i>
          {{ categoryId ? 'Save Changes' : 'Create Category' }}
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="loadingError" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      Error loading category: {{ loadingError }}
    </div>

    <!-- Form -->
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSave" class="needs-validation" novalidate>
          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Category Name <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="category.name"
              required
              :class="{ 'is-invalid': saveError }"
              placeholder="Enter category name"
            >
            <div v-if="saveError" class="invalid-feedback">
              {{ saveError }}
            </div>
            <div class="form-text">A clear, concise name for the category.</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '../../../composables/useSupabase'

const route = useRoute()
const router = useRouter()
const { getCurrentUser, getCategory, createCategory, updateCategory } = useSupabase()

// Type pour l'utilisateur Supabase
interface User {
  email: string;
  [key: string]: any; // Pour accepter d'autres propriétés que pourrait avoir l'utilisateur Supabase
}

const user = ref<{ email: string } | null>(null)

// State
const categoryId = computed<string>(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : (Array.isArray(id) ? id[0] : '')
})
const category = ref<{ name: string }>({ name: '' })
const saveError = ref('')
const isSaving = ref(false)
const loadingError = ref('')

// Load category data if editing
onMounted(async () => {
  try {
    // Récupérer l'utilisateur connecté
    const currentUser = await getCurrentUser()
    if (currentUser) {
      user.value = { email: currentUser.email || 'Utilisateur connecté' }
    }
    
    // Si un ID de catégorie est présent dans l'URL, charger la catégorie
    if (categoryId.value) {
      try {
        const data = await getCategory(categoryId.value)
        if (data) {
          category.value = data
        } else {
          loadingError.value = 'Category not found'
        }
      } catch (error: any) {
        console.error('Error fetching category:', error)
        loadingError.value = error.message || 'Failed to load category'
      }
    }
  } catch (error: any) {
    console.error('Error in onMounted:', error)
  }
})

// La validation est maintenant gérée directement dans handleSave

// Save category
const handleSave = async () => {
  if (isSaving.value) return

  // Reset error state
  saveError.value = ''
  
  // Validate form
  if (!category.value.name || category.value.name.trim() === '') {
    saveError.value = 'Category name is required'
    return
  }

  if (category.value.name.length > 50) {
    saveError.value = 'Category name cannot exceed 50 characters'
    return
  }

  try {
    isSaving.value = true

    // Prepare data for saving
    const categoryData = {
      name: category.value.name.trim()
    }

    // Update or create category
    if (categoryId.value) {
      // Update existing category
      await updateCategory(categoryId.value, categoryData)
    } else {
      // Create new category
      await createCategory(categoryData)
    }

    // Redirect to admin page after successful save
    router.push('/admin')
  } catch (error: any) {
    console.error('Error saving category:', error)
    saveError.value = error.message || 'Failed to save category'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>