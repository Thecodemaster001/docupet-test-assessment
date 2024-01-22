import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'
import './styles/base.css'
import App from './App.vue'
import router from './router'

// SVG icons ship inside the bundle; the default icon font was never installed, so radios had no glyphs.
const vuetify = createVuetify({
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: 'registry',
    themes: {
      registry: {
        dark: false,
        colors: {
          primary: '#1f5c50',
          secondary: '#c4622d',
          background: '#fbf6ee',
          surface: '#ffffff',
          error: '#a3271c',
          success: '#2e6b3a',
        },
      },
    },
  },
  defaults: {
    VBtn: { class: 'text-none', rounded: 'pill' },
    VBtnToggle: { rounded: 'pill' },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
