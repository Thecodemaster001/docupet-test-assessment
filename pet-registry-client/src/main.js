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
})

createApp(App).use(router).use(vuetify).mount('#app')
