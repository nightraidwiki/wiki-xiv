<template>
  <div class="max-w-5xl mx-auto px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">{{ isNew ? 'Nouvel article' : 'Modifier l\'article' }}</h1>
      <div class="flex gap-4">
        <UButton
          color="gray"
          variant="soft"
          to="/admin"
        >
          Annuler
        </UButton>
        <UButton
          color="primary"
          :loading="saving"
          @click="saveArticle"
        >
          Enregistrer
        </UButton>
      </div>
    </div>

    <form @submit.prevent="saveArticle" class="space-y-6">
      <UCard>
        <div class="space-y-4">
          <UFormGroup label="Titre" name="title">
            <UInput
              v-model="article.title"
              placeholder="Titre de l'article"
              required
            />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Catégorie" name="category">
              <USelect
                v-model="article.category"
                :options="categories"
                required
              />
            </UFormGroup>

            <UFormGroup label="Visibilité" name="visible">
              <UToggle v-model="article.visible">
                {{ article.visible ? 'Visible' : 'Non visible' }}
              </UToggle>
            </UFormGroup>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold">Contenu</h2>
          </div>
        </template>

        <div class="prose max-w-none">
          <editor-content :editor="editor" />
        </div>
      </UCard>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const route = useRoute()
const isNew = route.params.id === 'new'
const saving = ref(false)

const article = ref({
  title: '',
  category: '',
  visible: true,
  content: ''
})

const categories = [
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
  }
})

const saveArticle = async () => {
  saving.value = true
  try {
    // TODO: Implémenter la sauvegarde avec Supabase
    console.log('Saving article:', article.value)
  } catch (error) {
    console.error('Save error:', error)
  } finally {
    saving.value = false
  }
}

// Si ce n'est pas un nouvel article, charger les données
if (!isNew) {
  // TODO: Charger l'article depuis Supabase
}
</script>

<style>
.ProseMirror {
  min-height: 300px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.ProseMirror:focus {
  outline: none;
  border-color: #3b82f6;
}
</style> 