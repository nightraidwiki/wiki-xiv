<template>
  <div class="container">
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control search-input"
          placeholder="Search for an article by name or tag..."
        />
      </div>

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
    <div v-if="pending" class="row">
      <div class="col-12 col-lg-6 mb-4" v-for="n in 6" :key="n">
        <article class="flex css_article_bloc skeleton-bloc">
          <div class="skeleton-shimmer"></div>
          <div class="d-flex css_info_article h-100 w-100">
             <div class="skeleton-icon flex-shrink-0"></div>
             <div class="d-flex flex-column w-100">
               <div class="skeleton-text skeleton-title"></div>
               <div class="skeleton-text skeleton-date"></div>
               <div class="d-flex mt-auto mb-4">
                 <div class="skeleton-tag me-1"></div>
                 <div class="skeleton-tag"></div>
               </div>
             </div>
           </div>
        </article>
      </div>
    </div>
    <div v-else class="row">
      <div class="col-12 col-lg-6 mb-4" v-for="article in filteredArticles" :key="article.id">
      <NuxtLink :to="`/articles/${article.slug || article.id}`" class="css_article_link">
        <article class="flex css_article_bloc">
          <img v-if="article.banner_url" :src="article.banner_url" class="css_banner_char">
          <div class="d-flex css_info_article">
            <!-- Icône de la catégorie dynamique -->
            <img :src="getCategoryIcon(article.category_name)" :alt="`Category: ${article.category_name}`" class="css_icon_article">
            <div class="d-flex flex-column">
              <h4>{{ article.title }}</h4>
              <span class="css_published_date">Published: {{ formatDate(article.created_at) }}</span>
              <div class="d-flex flex-wrap mt-auto mb-2 mb-md-4 gap-1">
                <span class="tag">{{ article.category_name }}</span>
                <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
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
import { ref, computed } from 'vue'

const { supabase } = useSupabase()

useSeoMeta({
  title: 'FFXIV Guides & Documentation - Wiki XIV',
  description: 'Browse our extensive collection of guides, technical articles, and documentation for Final Fantasy XIV.',
  ogTitle: 'FFXIV Articles & Documentation - Wiki XIV',
  ogDescription: 'Find the best guides and tools for Final Fantasy XIV in our article database.',
  ogImage: '/logo_wiki.png',
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Wiki XIV Articles",
        "description": "Collection of guides and documentation for Final Fantasy XIV",
        "url": "https://wiki-xiv.com/articles"
      })
    }
  ]
})

const { data: articles, pending, error } = useAsyncData('published_articles', async () => {
  // Charger articles et banners en parallèle
  const [articlesRes, bannersRes] = await Promise.all([
    supabase.from('articles')
      .select('*, categories(name), article_tags(tag_id, tags(name))')
      .eq('visible', true)
      .order('created_at', { ascending: false }),
    supabase.from('images_banner').select('id, image')
  ])
  const articlesData = articlesRes.data || []
  const bannersData = bannersRes.data || []
  // Log pour debug
  console.log('Articles récupérés :', articlesData)
  console.log('Banners récupérés :', bannersData)
  // Ajoute banner_url à chaque article, et remap category_name/tags
  return articlesData.map(article => ({
    ...article,
    banner_url: article.banner_id ? (bannersData.find(b => b.id === article.banner_id)?.image || '') : '',
    category_name: article.categories?.name || '',
    tags: (article.article_tags || []).map(at => at.tags?.name).filter(Boolean)
  }))
})

const selectedCategories = ref<string[]>([])
const selectedTags = ref<string[]>([])
const searchQuery = ref('')

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
  
  return articles.value.filter(article => {
    // 1. Filter by Category
    const catOk = selectedCategories.value.length === 0 || selectedCategories.value.includes(article.category_name)
    // 2. Filter by Tag
    const tagOk = selectedTags.value.length === 0 || (article.tags && article.tags.some((tag: string) => selectedTags.value.includes(tag)))
    
    // 3. Filter by Search Query (Name or Tag)
    let searchOk = true
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const titleMatch = article.title?.toLowerCase().includes(q)
      const tagMatch = article.tags?.some((tag: string) => tag.toLowerCase().includes(q))
      searchOk = titleMatch || tagMatch
    }

    return catOk && tagOk && searchOk
  })
})


function getCategoryIcon(category: string) {
  if (!category) return '/categories/bg_article.png';
  // Slugify: minuscule, sans espaces, sans accents ni caractères spéciaux
  const slug = category
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
    .replace(/[^a-z0-9]/g, '');
  return `/categories/${slug}.png`;
}

function formatDate(dateString: string) {
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

.search-input {
  background: transparent;
  border: 1px solid #8788ee;
  color: #fff;
  border-radius: 4px;
  padding: 10px 15px;
}
.search-input::placeholder {
  color: #8788ee;
  opacity: 0.7;
}
.search-input:focus {
  background: rgba(135, 136, 238, 0.1);
  border-color: #a259ec;
  color: #fff;
  box-shadow: 0 0 0 0.2rem rgba(135, 136, 238, 0.25);
  outline: none;
}

/* Skeleton Styles */
.skeleton-bloc {
  background-image: none !important;
  background-color: #1a1b1b;
  border-color: #2b2c2c;
  pointer-events: none;
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite linear;
  z-index: 1;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  margin-right: 8px;
  border-radius: 4px;
}

.skeleton-text {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  margin-top: 4px;
}

.skeleton-date {
  height: 14px;
  width: 40%;
}

.skeleton-tag {
  height: 20px;
  width: 60px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

@media (max-width: 768px) {
  /* Keep fixed height from desktop, just adjust internals */
  
  /* Narrower banner on mobile */
  .css_article_bloc img.css_banner_char {
    position: absolute; 
    width: 80px;
    height: 100%;
    object-fit: cover;
    object-position: center;
    top: 0;
    left: 0;
  }

  /* Adjust content margin to match narrower banner */
  .css_info_article {
    margin-left: 95px; /* 80px image + 15px gap */
    padding-top: 10px;
    padding-bottom: 5px;
    width: auto; 
    padding-right: 10px;
    height: 100%; /* Ensure full height usage */
  }

  .css_article_bloc h4 {
    font-size: 1rem; /* Smaller title on mobile */
    line-height: 1.2;
    margin-bottom: 2px;
  }

  .css_published_date {
    font-size: 0.75rem;
    margin-bottom: 4px;
    display: block;
  }

  .tag {
    font-size: 0.65rem;
    padding: 0 4px;
    line-height: 1.4;
  }
}
</style>