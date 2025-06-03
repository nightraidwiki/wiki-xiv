<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <article class="flex css_article_bloc">
          <div class="d-flex css_info_article">
            <!-- Insérer icone de la category -->
            <img src="/public/categories/act.png" alt="" class="css_icon_article">
            <div class="d-flex flex-column">
              <h4>This is a title article</h4>
              <span class="css_published_date">Published: created_at</span>
              <div class="d-flex mt-auto mb-4">
              <span class="tag">Category</span>
            </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Articles publiés</h1>
    <div v-if="pending">Loading articles...</div>
    <div v-else-if="error">Error loading articles: {{ error.message }}</div>
    <ul v-else-if="articles && articles.length">
      <li v-for="article in articles" :key="article.id" class="mb-4">
        <NuxtLink :to="`/articles/${article.id}`" class="text-blue-400 hover:underline text-xl">
          {{ article.title }} ({{ article.id }})
        </NuxtLink>
      </li>
    </ul>
    <div v-else>No published articles found.</div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

const { data: articles, pending, error } = useAsyncData('published_articles', async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title')
    .eq('visible', true) // assuming 'visible' column indicates published status
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
})
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
.css_article_bloc {
  border: 1px solid #ccc;
  background-image: url('/public/categories/bg_article.png');
  height: 160px;
}
.css_article_bloc h4 {
  color: #8788ee;
  font-weight: bold;
  margin-bottom: 0;
}
.css_article_bloc img.css_icon_article {
  height: 40px;
  width: 40px;
  margin-right: 8px;
}
.css_info_article {
  margin-left: 150px;
  padding-top: 15px;
}
.css_published_date {
  font-weight: 300;
  color: #b1afaf;
  font-size: 12px;
}
.tag {
  background: rgb(43, 44, 44);
  color: #fff;
  border-radius: 2px;
  padding: 0 6px;
}
</style> 