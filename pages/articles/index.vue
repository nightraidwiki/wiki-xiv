<template>
  <div class="container">
    <!-- Filtres combinés catégories + tags -->
    <div class="mb-4 d-flex flex-wrap align-items-center gap-2">
      <button
        class="btn btn-sm filter-btn"
        :class="{ active: selectedCategories.length === 0 && selectedTags.length === 0 }"
        @click="selectedCategories = []; selectedTags = []"
      >All</button>
      <button
        v-for="cat in uniqueCategories"
        :key="'cat-' + cat"
        class="btn btn-sm filter-btn"
        :class="{ active: selectedCategories.includes(cat) }"
        @click="toggleCategory(cat)"
      >{{ cat }}</button>
      <button
        v-for="tag in uniqueTags"
        :key="'tag-' + tag"
        class="btn btn-sm filter-btn"
        :class="{ active: selectedTags.includes(tag) }"
        @click="toggleTag(tag)"
      >{{ tag }}</button>
    </div>
    <div class="row">
      <div class="col-12 col-lg-6 mb-4" v-for="article in filteredArticles" :key="article.id">
      <NuxtLink :to="`/articles/${article.id}`" class="css_article_link">
        <article class="flex css_article_bloc">
          <img v-if="article.banner_url" :src="article.banner_url" class="css_banner_char">
          <div class="d-flex css_info_article">
            <!-- Icône de la catégorie dynamique -->
            <img :src="getCategoryIcon(article.category_name)" :alt="article.category_name" class="css_icon_article">
            <div class="d-flex flex-column">
              <h4>{{ article.title }}</h4>
              <span class="css_published_date">Published: {{ formatDate(article.created_at) }}</span>
              <div class="d-flex mt-auto mb-4">
                <span class="tag">{{ article.category_name }}</span>
                <span v-for="tag in article.tags" :key="tag" class="tag ms-1">{{ tag }}</span>
              </div>
            </div>
          </div>
        </article>
      </NuxtLink>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { ref, onMounted } from 'vue'

const { supabase } = useSupabase()

const { data: articles, pending, error } = useAsyncData('published_articles', async () => {
  // Charger articles et banners en parallèle
  const [articlesRes, bannersRes] = await Promise.all([
    supabase.from('articles').select('*').eq('visible', true).order('created_at', { ascending: false }),
    supabase.from('images_banner').select('id, image')
  ])
  const articlesData = articlesRes.data || []
  const bannersData = bannersRes.data || []
  // Log pour debug
  console.log('Articles récupérés :', articlesData)
  console.log('Banners récupérés :', bannersData)
  // Ajoute banner_url à chaque article
  return articlesData.map(article => ({
    ...article,
    banner_url: article.banner_id ? (bannersData.find(b => b.id === article.banner_id)?.image || '') : '',
    category_name: article.categories?.name || '',
    tags: (article.article_tags || []).map(at => at.tags?.name).filter(Boolean)
  }))
})

import { ref, computed } from 'vue'

const selectedCategories = ref<string[]>([])
const selectedTags = ref<string[]>([])

const uniqueCategories = computed(() => {
  if (!articles.value) return []
  const set = new Set(articles.value.map(a => a.category_name).filter(Boolean))
  return Array.from(set)
})

const uniqueTags = computed(() => {
  if (!articles.value) return []
  const tagsFlat = articles.value.flatMap(a => a.tags || [])
  return Array.from(new Set(tagsFlat))
})

function toggleCategory(cat: string) {
  const idx = selectedCategories.value.indexOf(cat)
  if (idx === -1) selectedCategories.value.push(cat)
  else selectedCategories.value.splice(idx, 1)
}

function toggleTag(tag: string) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(idx, 1)
}

const filteredArticles = computed(() => {
  if (!articles.value) return []
  // Aucun filtre : tout afficher
  if (selectedCategories.value.length === 0 && selectedTags.value.length === 0) return articles.value
  return articles.value.filter(article => {
    const catOk = selectedCategories.value.length === 0 || selectedCategories.value.includes(article.category_name)
    const tagOk = selectedTags.value.length === 0 || (article.tags && article.tags.some(tag => selectedTags.value.includes(tag)))
    return catOk && tagOk
  })
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
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
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
.filter-btn {
  border-color: #8788ee !important;
  color: #8788ee !important;
  background: transparent !important;
  transition: background 0.2s, color 0.2s;
}
.filter-btn.active, .filter-btn:active, .filter-btn:hover {
  background: #8788ee !important;
  color: #fff !important;
  border-color: #8788ee !important;
}

</style>