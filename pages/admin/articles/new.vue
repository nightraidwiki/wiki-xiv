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

const router = useRouter()
const route = useRoute()

// Mock Supabase pour le moment - À remplacer par l'import réel de votre configuration Supabase
interface SupabaseResponse {
  data: any;
  error: Error | null;
}

interface SupabaseQueryBuilder {
  select: (fields: string) => {
    eq: (field: string, value: any) => {
      single: () => Promise<SupabaseResponse>;
    };
  };
  update: (data: any) => {
    eq: (field: string, value: any) => Promise<{ error: Error | null }>;
  };
  insert: (data: any) => Promise<{ error: Error | null }>;
}

interface SupabaseClient {
  auth: {
    getUser: () => Promise<{ data: { user: { email: string } | null } }>;
  };
  from: (table: string) => SupabaseQueryBuilder;
}

const supabase: SupabaseClient = {
  auth: {
    getUser: async () => ({
      data: { user: { email: 'admin@example.com' } }
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: { 
            title: '',
            content: '',
            visible: false
          }, 
          error: null 
        })
      })
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: null })
    }),
    insert: () => Promise.resolve({ error: null })
  })
} as SupabaseClient;

interface User {
  email: string;
}

interface ArticleData {
  title: string;
  content: string;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

const articleId = route.query.id as string | undefined

const form = reactive({
  title: '',
  content: '',
  published: false
})

const saving = ref(false)
const user = ref<User | null>(null)
const loadingError = ref<string | null>(null)

const editorRef = ref<any>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
  if (!user.value) {
    router.push('/auth/login')
  }

  // Si un ID d'article est présent dans l'URL, charger l'article
  if (articleId) {
    try {
      const { data: articleData, error } = await supabase
        .from('articles')
        .select('title, content, visible')
        .eq('id', articleId)
        .single()

      if (error) {
        console.error('Error loading article for editing:', error)
        loadingError.value = error.message // Store the error message
        // TODO: Afficher une notification d'erreur
        return
      }

      if (articleData) {
        form.title = articleData.title || ''
        form.content = articleData.content || ''
        form.published = articleData.visible || false
      }
    } catch (e) {
      console.error('Error in article loading:', e)
      loadingError.value = 'Failed to load article data'
    }
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
    
    const articleData = {
      title: form.title,
      content: form.content,
      visible: form.published,
      updated_at: new Date().toISOString()
    }

    if (articleId) {
      // Mettre à jour l'article existant
      const { error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', articleId)

      if (error) throw error

      console.log('Article updated successfully!')
      // TODO: Afficher une notification de succès
    } else {
      // Créer un nouvel article
      const { error } = await supabase
        .from('articles')
        .insert({
          ...articleData,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      console.log('Article created successfully!')
      // TODO: Afficher une notification de succès
    }
    
    // Nettoyer manuellement l'éditeur avant la navigation
    if (editorRef.value) {
      editorRef.value.cleanupEditor?.()
    }
    // Rediriger vers le dashboard admin après la sauvegarde/mise à jour
    await router.push('/admin')
  } catch (e: any) {
    console.error('Error saving article:', e)
    // TODO: Ajouter une notification d'erreur pour l'utilisateur
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