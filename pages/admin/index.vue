<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <UButton
        to="/admin/articles/new"
        color="primary"
        icon="i-heroicons-plus"
      >
        Nouvel article
      </UButton>
    </div>

    <!-- Tableau des articles -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Articles</h2>
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher..."
            class="max-w-xs"
          />
        </div>
      </template>

      <UTable
        :columns="columns"
        :rows="articles"
        :search="search"
      >
        <template #visible-data="{ row }">
          <UToggle v-model="row.visible" />
        </template>

        <template #actions-data="{ row }">
          <UButton
            :to="'/admin/articles/' + row.id"
            color="primary"
            variant="ghost"
            icon="i-heroicons-pencil-square"
          />
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="deleteArticle(row.id)"
          />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const search = ref('')

const columns = [
  {
    key: 'title',
    label: 'Titre'
  },
  {
    key: 'category',
    label: 'Catégorie'
  },
  {
    key: 'visible',
    label: 'Visible'
  },
  {
    key: 'updated_at',
    label: 'Dernière modification'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]

const articles = ref([
  {
    id: 1,
    title: 'Premier article',
    category: 'Guides',
    visible: true,
    updated_at: '2024-03-20'
  },
  // Ajoutez d'autres articles pour tester
])

const deleteArticle = async (id: number) => {
  // TODO: Implémenter la suppression avec Supabase
  console.log('Deleting article:', id)
}
</script> 