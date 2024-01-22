<template>
  <v-app>
    <header class="site-header">
      <router-link
        to="/"
        class="brand"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 13.5c-2.9 0-6 2.6-6 5.2 0 1.5 1.2 2.3 2.6 2.3 1.3 0 2.2-.6 3.4-.6s2.1.6 3.4.6c1.4 0 2.6-.8 2.6-2.3 0-2.6-3.1-5.2-6-5.2zM5.2 12.6c1.3-.3 1.9-1.9 1.5-3.5S5 6.4 3.7 6.7 1.8 8.6 2.2 10.2s1.7 2.7 3 2.4zm13.6 0c1.3.3 2.6-.8 3-2.4s-.2-3.2-1.5-3.5-2.6.8-3 2.4.2 3.2 1.5 3.5zM9.3 8.6c1.4 0 2.4-1.5 2.4-3.3S10.7 2 9.3 2 6.9 3.5 6.9 5.3s1 3.3 2.4 3.3zm5.4 0c1.4 0 2.4-1.5 2.4-3.3S16.1 2 14.7 2s-2.4 1.5-2.4 3.3 1 3.3 2.4 3.3z" />
        </svg>
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
