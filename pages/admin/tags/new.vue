<template>
  <div class="container py-4">
    <h1 class="h4 mb-4 text-primary">Créer un tag</h1>
    <form @submit.prevent="handleSubmit" class="card p-4 bg-dark-subtle">
      <div class="mb-3">
        <label for="tagName" class="form-label">Nom du tag</label>
        <input
          id="tagName"
          v-model="name"
          type="text"
          class="form-control"
          :class="{'is-invalid': error}"
          maxlength="50"
          required
          placeholder="Ex: guide, astuce, patchnote..."
        />
        <div v-if="error" class="invalid-feedback">{{ error }}</div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Créer
      </button>
      <NuxtLink to="/admin" class="btn btn-link ms-2">Annuler</NuxtLink>
    </form>
    <div v-if="success" class="alert alert-success mt-3">
      Tag créé avec succès !
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

const name = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)
const router = useRouter()
const { supabase } = useSupabase()

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  if (!name.value.trim()) {
    error.value = 'Le nom du tag est requis.'
    return
  }
  if (name.value.length > 50) {
    error.value = 'Le nom ne doit pas dépasser 50 caractères.'
    return
  }
  loading.value = true
  try {
    // Vérifier unicité
    const { data: existing, error: fetchErr } = await supabase
      .from('tags')
      .select('id')
      .eq('name', name.value.trim())
      .single()
    if (existing) {
      error.value = 'Ce tag existe déjà.'
      loading.value = false
      return
    }
    // Insérer le tag
    const { error: insertErr } = await supabase
      .from('tags')
      .insert([{ name: name.value.trim() }])
    if (insertErr) throw insertErr
    success.value = true
    setTimeout(() => router.push('/admin'), 1000)
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la création du tag.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-dark-subtle {
  background-color: #2c3034 !important;
  border-color: rgba(255,255,255,0.1) !important;
}
</style>
