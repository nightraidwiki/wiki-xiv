// Plugin pour intégrer Bootstrap dans Nuxt 3
import { defineNuxtPlugin } from 'nuxt/app'
import * as bootstrap from 'bootstrap'

export default defineNuxtPlugin((nuxtApp) => {
  // Rendre les composants Bootstrap disponibles globalement
  nuxtApp.provide('bootstrap', bootstrap)
  
  // Initialiser les tooltips et popovers de Bootstrap
  nuxtApp.hook('app:mounted', () => {
    // Initialiser tous les tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(
      tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
    )
    
    // Initialiser tous les popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(
      popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl)
    )
  })
})
