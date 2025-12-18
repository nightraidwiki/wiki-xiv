// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Configuration PostCSS désactivée
  postcss: {
    plugins: {}
  },

  // Modules
  modules: [
    '@pinia/nuxt'
  ],

  // Fichiers CSS globaux
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/css/main.css'
  ],

  // Configuration de l'application
  app: {
    head: {
      title: 'Wiki XIV - Resources & Tools for FFXIV',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Documentation, articles, and useful tools for Final Fantasy XIV players. Find repositories, plugins, and guides.' },
        { name: 'format-detection', content: 'telephone=no' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Wiki XIV' },
        { property: 'og:title', content: 'Wiki XIV - Resources & Tools for FFXIV' },
        { property: 'og:description', content: 'Documentation, articles, and useful tools for Final Fantasy XIV players.' },
        { property: 'og:image', content: '/logo.png' },
        { property: 'og:url', content: 'https://wiki-xiv.com' }, // Remplacer par l'URL réelle si connue
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Wiki XIV - Resources & Tools for FFXIV' },
        { name: 'twitter:description', content: 'Documentation, articles, and useful tools for Final Fantasy XIV players.' },
        { name: 'twitter:image', content: '/logo.png' }
      ],
      script: [
        { src: '/richtexteditor/rte.js' },
        // Ajout du JavaScript de Bootstrap (nécessite Popper.js)
        { src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js' },
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: '/richtexteditor/rte_theme_default.css' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter.css' }
      ]
    }
  },

  // Configuration d'exécution
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },

  // Configuration Vite
  vite: {
    css: {
      postcss: {}
    }
  }
})
