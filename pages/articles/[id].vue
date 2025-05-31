<template>
  <div class="max-w-4xl mx-auto px-4">
    <article class="py-8">
      <header class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <UBadge :color="article.category.color">
            {{ article.category.name }}
          </UBadge>
          <span class="text-gray-500">
            Publié le {{ new Date(article.published_at).toLocaleDateString() }}
          </span>
        </div>
        <h1 class="text-4xl font-bold">{{ article.title }}</h1>
      </header>

      <div class="prose max-w-none" v-html="article.content" />
    </article>

    <div class="border-t py-8">
      <UButton
        to="/"
        color="gray"
        variant="soft"
        icon="i-heroicons-arrow-left"
      >
        Retour aux articles
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const article = ref({
  title: 'Chargement...',
  content: '',
  category: {
    name: '',
    color: 'gray'
  },
  published_at: new Date().toISOString()
})

// TODO: Charger l'article depuis Supabase avec l'ID de la route
onMounted(async () => {
  try {
    // Simulation de chargement pour l'exemple
    article.value = {
      title: 'Mon premier article',
      content: '<p>Contenu de l\'article...</p>',
      category: {
        name: 'Guides',
        color: 'primary'
      },
      published_at: '2024-03-20'
    }
  } catch (error) {
    console.error('Error loading article:', error)
  }
})
</script> 