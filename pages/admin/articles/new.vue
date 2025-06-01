<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">New Article</h1>
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
          <span v-if="saving">Saving...</span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>

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
        <textarea
          v-model="form.content"
          class="form-input"
          rows="10"
          placeholder="Write your article content here..."
        ></textarea>
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
const router = useRouter()
const { supabase } = useSupabase()

const form = reactive({
  title: '',
  content: '',
  published: false
})

const saving = ref(false)
const user = ref<User | null>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
  if (!user.value) {
    router.push('/auth/login')
  }
})

async function handleSave() {
  try {
    saving.value = true
    const { error } = await supabase
      .from('articles')
      .insert(form)

    if (error) throw error
    await router.push('/admin')
  } catch (e: any) {
    console.error('Error saving article:', e)
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