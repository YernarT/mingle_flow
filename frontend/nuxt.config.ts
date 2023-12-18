// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",

  devtools: { enabled: true },

  devServer: {
    port: 3000,
  },

  css: [
    "~/assets/style/variables.css",
    "~/assets/style/reset.css",
    // Global class
    "~/assets/style/itisit-icon.css",
  ],

  modules: ["@pinia/nuxt", "nuxt-icon", "nuxt-lodash"],
});
