<template>
  <div class="container">
    <div class="row">
      <div class="col-6 mb-4" v-for="article in articles" :key="article.id">
      <NuxtLink :to="`/articles/${article.id}`" class="css_article_link">
        <article class="flex css_article_bloc">
          <img src="/public/categories/ysh.png" class="css_banner_char">
          <div class="d-flex css_info_article">
            <!-- Icône de la catégorie dynamique -->
            <img :src="getCategoryIcon(article.category_name)" :alt="article.category_name" class="css_icon_article">
            <div class="d-flex flex-column">
              <h4>{{ article.title }}</h4>
              <span class="css_published_date">Published: {{ formatDate(article.created_at) }}</span>
              <div class="d-flex mt-auto mb-4">
                <span class="tag">{{ article.category_name }}</span>
              </div>
            </div>
          </div>
        </article>
      </NuxtLink>
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
    .select('id, title, created_at, category_id, categories(name)')
    .eq('visible', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Remap pour avoir article.category_name directement
  return (data || []).map(article => ({
    ...article,
    category_name: article.categories?.name || ''
  }))
})

function getCategoryIcon(category) {
  if (!category) return '/categories/bg_article.png';
  // Slugify: minuscule, sans espaces, sans accents ni caractères spéciaux
  const slug = category
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
    .replace(/[^a-z0-9]/g, '');
  return `/categories/${slug}.png`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
.css_article_bloc {
  border: 1px solid #ccc;
  background-image: url('/public/categories/bg_article.png');
  height: 160px;
  position: relative;
  overflow: hidden;
}
.css_article_bloc img.css_banner_char {
  position: absolute;
  height: 550px;
  top: -66px;
  left: -186px;
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
.css_article_link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.css_article_bloc {
  transition: box-shadow 0.2s, border-color 0.2s;
}
.css_article_link:hover .css_article_bloc {
  box-shadow: 0 0 12px 0 #a259ec99;
  border-color: #a259ec;
  cursor: pointer;
}
</style>