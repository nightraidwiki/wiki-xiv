<template>
  <div class="container py-4">
    <!-- En-tête -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0">
        <i class="bi me-2" :class="isNew ? 'bi-file-earmark-plus' : 'bi-pencil-square'"></i>
        {{ isNew ? 'Nouvel article' : 'Modifier l\'article' }}
      </h1>
      <div class="d-flex gap-2">
        <NuxtLink to="/admin" class="btn btn-outline-secondary">
          <i class="bi bi-x-lg me-1"></i> Annuler
        </NuxtLink>
        <button 
          type="button"
          class="btn btn-primary"
          @click="saveArticle"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          <i v-else class="bi bi-save me-1"></i>
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="saveArticle" class="needs-validation" novalidate>
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <!-- Titre -->
          <div class="mb-4">
            <label for="articleTitle" class="form-label fw-semibold">Titre</label>
            <input
              id="articleTitle"
              v-model="article.title"
              type="text"
              class="form-control form-control-lg"
              placeholder="Titre de l'article"
              required
            >
            <div class="invalid-feedback">
              Veuillez saisir un titre pour l'article.
            </div>
          </div>

          <!-- Catégorie et Visibilité -->
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label for="articleCategory" class="form-label fw-semibold">Catégorie</label>
              <select 
                id="articleCategory"
                v-model="article.category" 
                class="form-select"
                required
              >
                <option v-for="(cat, index) in categories" :key="index" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <div class="form-check form-switch pt-4">
                <input
                  id="visibilitySwitch"
                  v-model="article.visible"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                >
                <label class="form-check-label fw-semibold" for="visibilitySwitch">
                  {{ article.visible ? 'Visible' : 'Non visible' }}
                </label>
              </div>
              <div class="form-text">
                {{ article.visible ? 'Cet article est visible par le public' : 'Cet article est enregistré comme brouillon' }}
              </div>
            </div>
          </div>

          <!-- Éditeur de contenu -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Contenu</label>
            <div class="border rounded p-3">
              <editor-content :editor="editor" class="editor-content" />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

// Définition des types
interface Article {
  title: string
  category: string
  visible: boolean
  content: string
}

interface Category {
  label: string
  value: string
}

const route = useRoute()
const router = useRouter()
const isNew = route.params.id === 'new'
const saving = ref(false)

const article = ref<Article>({
  title: '',
  category: '',
  visible: true,
  content: ''
})

const categories: Category[] = [
  { label: 'Guides', value: 'guides' },
  { label: 'Tutoriels', value: 'tutorials' },
  { label: 'Actualités', value: 'news' }
]

const editor = useEditor({
  content: article.value.content,
  extensions: [
    StarterKit,
    Image
  ],
  onUpdate: ({ editor }) => {
    article.value.content = editor.getHTML()
  },
  editorProps: {
    attributes: {
      class: 'prose max-w-none focus:outline-none',
      style: 'min-height: 300px;'
    }
  }
})

const saveArticle = async () => {
  saving.value = true
  try {
    // Vérification de la validation du formulaire
    const form = document.querySelector('.needs-validation') as HTMLFormElement
    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      saving.value = false
      return
    }

    // Simulation de sauvegarde
    console.log('Saving article:', article.value)
    
    // Redirection après sauvegarde
    await router.push('/admin')
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // TODO: Afficher une notification d'erreur
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  // Si ce n'est pas un nouvel article, charger les données
  if (!isNew) {
    // Simulation de chargement d'un article
    setTimeout(() => {
      article.value = {
        title: 'Titre de l\'article',
        category: 'guides',
        visible: true,
        content: '<p>Contenu de l\'article...</p>'
      }
      
      // Mettre à jour l'éditeur avec le contenu
      if (editor.value) {
        editor.value.commands.setContent(article.value.content)
      }
    }, 500)
  }
})

// Nettoyage de l'éditeur
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
.editor-content {
  min-height: 300px;
}

:deep(.ProseMirror) {
  min-height: 300px;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

:deep(.ProseMirror:focus) {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

:deep(.ProseMirror p) {
  margin-bottom: 1rem;
}

:deep(.ProseMirror h1),
:deep(.ProseMirror h2),
:deep(.ProseMirror h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

:deep(.ProseMirror h1) {
  font-size: 2rem;
}

:deep(.ProseMirror h2) {
  font-size: 1.75rem;
}

:deep(.ProseMirror h3) {
  font-size: 1.5rem;
}
</style> 