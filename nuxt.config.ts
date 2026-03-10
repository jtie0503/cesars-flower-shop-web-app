// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

 routeRules: {
    "/api/v1/products/**": { proxy: `${process.env.API_CORE}/api/v1/products/**` },
    "/api/v1/orders/**": { proxy: `${process.env.API_CORE}/api/v1/orders/**` },
    "/api/v1/upload/**": { proxy: `${process.env.API_CORE}/api/v1/upload/**` },
     "/api/v1/auth/**": { proxy: `${process.env.API_CORE}/api/v1/auth/**` },
     "/api/v1/contact/**": { proxy: `${process.env.API_CORE}/api/v1/contact/**` },
},
  modules: ['vuetify-nuxt-module']
})