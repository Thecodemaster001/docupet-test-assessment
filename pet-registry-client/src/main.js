import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).use(createVuetify()).mount('#app')
