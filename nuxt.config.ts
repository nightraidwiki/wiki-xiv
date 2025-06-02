// https://nuxt.com/docs/api/configuration/nuxt-config
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
  css: ['~/assets/css/main.css'],
  
  // Configuration de l'application
  app: {
    head: {
      title: 'Wiki XIV',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Documentation et articles sur divers sujets' }
      ],
      script: [
        { src: '/richtexteditor/rte.js' }
      ],
      link: [
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
