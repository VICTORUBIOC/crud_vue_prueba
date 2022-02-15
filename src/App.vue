<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      class="align-center"
    >
    ARTICULOS
    </v-app-bar>

    <v-main>
      <Articulos/>
    </v-main>
  </v-app>
</template>

<script>
import Articulos from './components/articulos';

export default {
  name: 'App',

  components: {
    Articulos,
  },

  data: () => ({
    //
  }),
};
</script>
