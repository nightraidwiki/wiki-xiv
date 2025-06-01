<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">{{ articleId ? 'Edit Article' : 'New Article' }}</h1>
        <div class="flex items-center gap-2 mt-2">
          <div class="flex items-center gap-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="user ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span class="text-sm text-gray-400">
              {{ user ? `Connected as ${user.email}` : 'Not connected' }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex gap-4">
        <NuxtLink 
          to="/admin"
          class="button button-secondary"
        >
          Back
        </NuxtLink>
        <button 
          @click="handleSave"
          class="button button-primary"
          :disabled="saving"
        >
          <span v-if="saving">{{ articleId ? 'Saving...' : 'Creating...' }}</span>
          <span v-else>{{ articleId ? 'Save Changes' : 'Create Article' }}</span>
        </button>
      </div>
    </div>

    <div v-if="loadingError" class="text-red-500 mb-4">Error loading article for editing: {{ loadingError }}</div>

    <!-- Form -->
    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Title -->
      <div class="form-group">
        <label class="form-label">Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="form-input"
          placeholder="Article title"
        />
      </div>

      <!-- Content -->
      <div class="form-group">
        <label class="form-label">Content</label>
        <TiptapEditor
          v-model="form.content"
          placeholder="Write your article content here..."
        />
      </div>

      <!-- Published -->
      <div class="form-group">
        <label class="form-label">Published</label>
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="form.published"
            class="form-checkbox"
          />
          <span class="text-gray-300">{{ form.published ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { ref, reactive, onMounted } from 'vue'
import type { User } from '@supabase/supabase-js'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { supabase } = useSupabase()

const articleId = route.query.id as string | undefined

const form = reactive({
  title: '',
  content: '',
  published: false
})

const saving = ref(false)
const user = ref<User | null>(null)
const loadingError = ref<string | null>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
  if (!user.value) {
    router.push('/auth/login')
  }

  // Si un ID d'article est présent dans l'URL, charger l'article
  if (articleId) {
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
      form.title = articleData.title
      form.content = articleData.content
      form.published = articleData.visible
    }
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