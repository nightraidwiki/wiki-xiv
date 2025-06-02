// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
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
        { rel: 'stylesheet', href: '/richtexteditor/rte_theme_default.css' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})
