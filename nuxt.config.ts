// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: [
    '~/assets/css/main.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    '/': { redirect: 'https://nationalcowboymuseum.org' },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/icon.jpg' }
      ]
    }
  }
})