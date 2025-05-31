<template>
  <div>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Articles</h1>
      
      <!-- Filtres de catégories -->
      <div class="mb-8">
        <USelect
          v-model="selectedCategory"
          :options="categories"
          placeholder="Filtrer par catégorie"
          class="max-w-xs"
        />
      </div>

      <!-- Liste des articles -->
      <div class="space-y-6">
        <UCard
          v-for="article in articles"
          :key="article.id"
          :ui="{ body: { padding: 'p-6' } }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">{{ article.title }}</h2>
              <UBadge :color="article.category.color">
                {{ article.category.name }}
              </UBadge>
            </div>
          </template>

          <p class="text-gray-600 line-clamp-3">{{ article.excerpt }}</p>

          <template #footer>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">
                Publié le {{ new Date(article.published_at).toLocaleDateString() }}
              </span>
              <UButton
                :to="'/articles/' + article.id"
                color="primary"
                variant="soft"
              >
                Lire la suite
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedCategory = ref('')

// Données temporaires pour l'exemple
const categories = [
  { label: 'Toutes les catégories', value: '' },
  { label: 'Guides', value: 'guides' },
  { label: 'Tutoriels', value: 'tutorials' },
  { label: 'Actualités', value: 'news' }
]

const articles = ref([
  {
    id: 1,
    title: 'Premier article',
    excerpt: 'Ceci est un extrait du premier article...',
    category: { name: 'Guides', color: 'primary' },
    published_at: '2024-03-20'
  },
  // Ajoutez d'autres articles pour tester
])
</script> 