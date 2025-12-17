<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { User } from '@supabase/supabase-js'

const { supabase } = useSupabase()
const route = useRoute()
const slug = route.params.slug as string
const user = ref<User | null>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
})

const { data: article, pending, error } = useAsyncData(`article-${slug}`, async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, content') 
    .eq('slug', slug)
    .single()

  if (error) throw error

  return data
})

const selectedImage = ref<string | null>(null)

const handleArticleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.tagName.toUpperCase() === 'IMG') {
    selectedImage.value = (target as HTMLImageElement).src
  }
}

const closeZoom = () => {
  selectedImage.value = null
}
</script>

<template>
  <div class="container py-5 css_article_container">
    <div v-if="pending" class="skeleton-article position-relative">
      <div class="skeleton-shimmer"></div>
      <!-- Header / Banner Rectangle -->
      <div class="skeleton-block skeleton-banner mb-4"></div>
      
      <!-- Title & Button placeholder -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div class="skeleton-block skeleton-title"></div>
        <div class="skeleton-block skeleton-button"></div>
      </div>

      <!-- Content Text Lines -->
      <div class="skeleton-block skeleton-line mb-2"></div>
      <div class="skeleton-block skeleton-line mb-2" style="width: 92%"></div>
      <div class="skeleton-block skeleton-line mb-2" style="width: 96%"></div>
      <div class="skeleton-block skeleton-line mb-2" style="width: 80%"></div>
      <div class="skeleton-block skeleton-line mb-2" style="width: 85%"></div>
    </div>
    <div v-else-if="error">Error loading article: {{ error.message }}</div>
    <div v-else-if="article">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 class="display-5 fw-bold mb-0">{{ article.title }}</h1>
        <div class="d-flex gap-2">
          <NuxtLink to="/articles" class="btn btn-outline-secondary">
             <i class="bi bi-arrow-left me-1"></i> Back to Articles
          </NuxtLink>
          <NuxtLink
            v-if="user && article?.id"
            :to="`/admin/articles/new?id=${article.id}`"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil me-1"></i> Edit
          </NuxtLink>
        </div>
      </div>
      <!-- Article Content with Click Handler -->
      <div class="prose dark:prose-invert" v-html="article.content" @click="handleArticleClick"></div>
      
      <NuxtLink to="/articles" class="btn btn-outline-secondary mt-5">
        <i class="bi bi-arrow-left me-1"></i> Back to Articles
      </NuxtLink>
    </div>
    <div v-else>Article not found.</div>

    <!-- Lightbox Overlay -->
    <Transition name="fade">
      <div v-if="selectedImage" class="lightbox-overlay" @click="closeZoom">
        <button class="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3" aria-label="Close"></button>
        <img :src="selectedImage" alt="Zoomed view" class="lightbox-image" />
      </div>
    </Transition>
  </div>
</template>

<style>
/* Ajoutez des styles si nécessaire */
pre {
  background: #1c1c1c;
  color: #d63384;
  padding: 1rem;
  border: 1px solid #fff;
}
</style>

<style scoped>
/* Skeleton Loader Styles */
.skeleton-article {
  max-width: 800px; /* Or whatever fits your layout */
  margin: 0 auto;
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
  z-index: 10;
  pointer-events: none;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton-block {
  background: #1a1b1b; /* Dark placeholder color matching other skeletons */
  border-radius: 4px;
}

.skeleton-banner {
  width: 100%;
  height: 300px; /* Big rectangle for image */
  border-radius: 8px;
}

.skeleton-title {
  height: 40px;
  width: 50%;
}

.skeleton-button {
  height: 36px;
  width: 80px;
}

.skeleton-line {
  height: 16px;
  width: 100%;
}

.btn-outline-secondary:hover,
.btn-outline-secondary:active,
.btn-outline-secondary:focus {
  color: #000 !important;
  background-color: #fff !important;
  border-color: #fff !important;
}

/* Responsive Artice Content */
.prose {
  max-width: 100%;
  overflow-wrap: break-word;
}

.prose :deep(img),
.prose :deep(video),
.prose :deep(iframe) {
  max-width: 100%;
  height: auto;
  display: block;
  cursor: zoom-in;
}

.prose :deep(pre) {
  max-width: 100%;
  overflow-x: auto;
}

.prose :deep(table) {
  display: block;
  overflow-x: auto;
  max-width: 100%;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
}

.lightbox-image {
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 