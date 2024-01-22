<template>
  <v-app>
    <header class="site-header">
      <router-link
        to="/"
        class="brand"
      >
        Pet Registry
      </router-link>
      <nav aria-label="Form versions">
        <router-link to="/">
          Standard form
        </router-link>
        <router-link to="/vuetify-pet-form">
          Vuetify form
        </router-link>
      </nav>
    </header>
    <main class="site-main">
      <router-view />
    </main>
  </v-app>
</template>
