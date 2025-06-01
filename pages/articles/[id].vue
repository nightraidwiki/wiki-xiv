<template>
  <div class="p-8">
    <div v-if="pending">Loading article...</div>
    <div v-else-if="error">Error loading article: {{ error.message }}</div>
    <div v-else-if="article">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">{{ article.title }}</h1>
        <NuxtLink
          v-if="user"
          :to="`/admin/articles/new?id=${articleId}`"
          class="button button-secondary"
        >
          Edit
        </NuxtLink>
      </div>
      <div class="prose dark:prose-invert" v-html="article.content"></div>
      <NuxtLink to="/articles" class="button button-secondary mt-8">Back to Articles</NuxtLink>
    </div>
    <div v-else>Article not found.</div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { User } from '@supabase/supabase-js'

const { supabase } = useSupabase()
const route = useRoute()
const articleId = route.params.id
const user = ref<User | null>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
})

const { data: article, pending, error } = useAsyncData(`article-${articleId}`, async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('title, content')
    .eq('id', articleId)
    .single()

  if (error) throw error

  return data
})
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
</style> 