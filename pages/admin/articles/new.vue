<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-2">
          <i class="bi bi-file-earmark-text me-2"></i>
          {{ articleId ? 'Edit Article' : 'New Article' }}
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
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          <i v-else class="bi me-1" :class="{ 'bi-save': articleId, 'bi-plus-circle': !articleId }"></i>
          {{ articleId ? 'Save Changes' : 'Create Article' }}
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="loadingError" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      Error loading article: {{ loadingError }}
    </div>

    <!-- Form -->
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSave" class="needs-validation" novalidate>
          <!-- Title -->
          <div class="mb-4">
            <label for="articleTitle" class="form-label fw-semibold">Title</label>
            <input
              id="articleTitle"
              v-model="form.title"
              type="text"
              class="form-control form-control-lg"
              placeholder="Enter article title"
              required
            >
            <div class="invalid-feedback">
              Please provide a title for the article.
            </div>
          </div>

          <!-- Category -->
          <div class="mb-4">
            <label for="categorySelect" class="form-label fw-semibold">Category</label>
            <select
              id="categorySelect"
              v-model="form.category_id"
              class="form-select"
              :disabled="loadingCategories"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <div v-if="loadingCategories" class="form-text">
              <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Loading categories...
            </div>
            <div v-else class="form-text">Select a category for this article</div>
          </div>

          <!-- Tags -->
          <div class="mb-4">
            <label for="tagsSelect" class="form-label fw-semibold">Tags</label>
            <select
              id="tagsSelect"
              v-model="selectedTags"
              class="form-select"
              multiple
              :disabled="loadingTags"
              style="min-height: 90px"
            >
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
            <div v-if="loadingTags" class="form-text">
              <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Chargement des tags...
            </div>
            <div v-else class="form-text">Sélectionnez un ou plusieurs tags pour cet article</div>
          </div>

          <!-- Content -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Content</label>
            <RichTextEditor
              v-model="form.content"
              placeholder="Write your article content here..."
              ref="editorRef"
              class="border rounded p-2"
            />
          </div>

          <!-- Tags -->
          <div class="mb-4">
            <label for="tagsSelect" class="form-label fw-semibold">Tags</label>
            <select
              id="tagsSelect"
              v-model="selectedTags"
              class="form-select"
              multiple
              :disabled="loadingTags"
              style="min-height: 90px"
            >
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
            <div v-if="loadingTags" class="form-text">
              <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Chargement des tags...
            </div>
            <div v-else class="form-text">Sélectionnez un ou plusieurs tags pour cet article</div>
          </div>

          <!-- Published -->
          <div class="mb-4">
            <div class="form-check form-switch">
              <input
                id="publishedSwitch"
                type="checkbox"
                v-model="form.published"
                class="form-check-input"
                role="switch"
              >
              <label class="form-check-label" for="publishedSwitch">
                {{ form.published ? 'Published' : 'Draft' }}
              </label>
            </div>
            <div class="form-text">
              {{ form.published ? 'This article is visible to the public.' : 'This article is saved as a draft and not visible to the public.' }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RichTextEditor from '~/components/RichTextEditor.vue'
import { useSupabase } from '../../../composables/useSupabase'

const router = useRouter()
const route = useRoute()
const { getCurrentUser, getArticle, createArticle, updateArticle, getCategories } = useSupabase()

interface User {
  email: string;
}

interface ArticleData {
  title: string;
  content: string;
  visible: boolean;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
}

const articleId = route.query.id as string | undefined

const form = reactive({
  title: '',
  content: '',
  category_id: '',
  published: false
})

// Variables pour les catégories
const categories = ref<Category[]>([])
const loadingCategories = ref(false)

// Variables pour les tags
const tags = ref<any[]>([])
const loadingTags = ref(false)
const selectedTags = ref<string[]>([])

const saving = ref(false)
const user = ref<User | null>(null)
const loadingError = ref<string | null>(null)

const editorRef = ref<any>(null)

onMounted(async () => {
  try {
    // Récupérer l'utilisateur connecté
    const currentUser = await getCurrentUser()
    if (currentUser) {
      user.value = { email: currentUser.email || 'Utilisateur connecté' }
    } else {
      router.push('/auth/login')
      return
    }
    // Récupérer les catégories
    loadingCategories.value = true
    try {
      categories.value = await getCategories() || []
    } catch (error: any) {
      console.error('Error loading categories:', error)
    } finally {
      loadingCategories.value = false
    }
    // Récupérer les tags
    loadingTags.value = true
    try {
      const { supabase } = useSupabase()
      const { data, error } = await supabase.from('tags').select('*')
      if (error) throw error
      tags.value = data || []
    } catch (error: any) {
      console.error('Error loading tags:', error)
    } finally {
      loadingTags.value = false
    }
    // Si un ID d'article est présent dans l'URL, charger l'article
    if (articleId) {
      try {
        const articleData = await getArticle(articleId)
        if (articleData) {
          form.title = articleData.title || ''
          form.content = articleData.content || ''
          form.category_id = articleData.category_id || ''
          form.published = articleData.visible || false
          // Charger les tags liés à l'article
          const { supabase } = useSupabase()
          const { data: tagLinks, error: tagLinksError } = await supabase
            .from('article_tags')
            .select('tag_id')
            .eq('article_id', articleId)
          if (tagLinksError) throw tagLinksError
          selectedTags.value = (tagLinks || []).map((t: any) => t.tag_id)
        }
      } catch (error: any) {
        console.error('Error loading article for editing:', error)
        loadingError.value = error.message || 'Failed to load article data'
      }
    }
  } catch (error: any) {
    console.error('Error in onMounted:', error)
    loadingError.value = error.message || 'An error occurred during initialization'
  }
})

// Watch for changes in form.content and editorRef
watch([() => form.content, editorRef], ([newContent, editorComponent]) => {
  // Ensure we are in edit mode (articleId exists), content is loaded, and editor is ready
  if (articleId && newContent && editorComponent) {
    // Use nextTick to ensure the editor component is fully rendered
    nextTick(() => {
      // Only set content if the editor's current content is different
      // This prevents resetting the editor while typing
      const currentHTML = editorComponent.getHTML()
      if (currentHTML !== newContent) {
        editorComponent.setHTML(newContent)
      }
    })
  }
})

async function handleSave() {
  try {
    saving.value = true
    const { supabase } = useSupabase()
    // Validation de base
    if (!form.title.trim()) {
      alert('Le titre est requis')
      saving.value = false
      return
    }
    const articleData = {
      title: form.title.trim(),
      content: form.content,
      category_id: form.category_id || null,
      visible: form.published,
      updated_at: new Date().toISOString()
    }
    let savedArticleId = articleId
    if (articleId) {
      // Mettre à jour l'article existant
      await updateArticle(articleId, articleData)
      // Synchroniser les tags (supprimer les anciens, ajouter les nouveaux)
      // 1. Supprimer les liaisons existantes non sélectionnées
      await supabase.from('article_tags').delete().eq('article_id', articleId)
      // 2. Ajouter les nouvelles liaisons
      if (selectedTags.value.length > 0) {
        const links = selectedTags.value.map(tagId => ({ article_id: articleId, tag_id: tagId }))
        await supabase.from('article_tags').insert(links)
      }
      console.log('Article updated successfully!')
    } else {
      // Créer un nouvel article
      const { data, error } = await supabase.from('articles').insert({
        ...articleData,
        created_at: new Date().toISOString()
      }).select('id').single()
      if (error) throw error
      savedArticleId = data.id
      // Ajouter les liaisons tags
      if (selectedTags.value.length > 0) {
        const links = selectedTags.value.map(tagId => ({ article_id: savedArticleId, tag_id: tagId }))
        await supabase.from('article_tags').insert(links)
      }
      console.log('Article created successfully!')
    }
    // Nettoyer manuellement l'éditeur avant la navigation
    if (editorRef.value) {
      editorRef.value.cleanupEditor?.()
    }
    // Rediriger vers le dashboard admin après la sauvegarde/mise à jour
    await router.push('/admin')
  } catch (error: any) {
    console.error('Error saving article:', error)
    alert(`Erreur lors de la sauvegarde: ${error.message || 'Une erreur est survenue'}`)
  } finally {
    saving.value = false
  }
}

</script>

<style scoped>
.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid #4b5563;
  background-color: var(--color-gray-750);
  cursor: pointer;
}

.form-checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}
</style> 