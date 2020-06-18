<template>
  <main id="app">
    <router-view/>
  </main>
</template>

<script>
  import { USER_REQUEST} from './store/actions/user';

  export default {
    name: 'app',
    created: function() {
      if (this.$store.getters.isAuthenticated) {
        this.$store.dispatch(USER_REQUEST);
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet">
  @import 'assets/sass/style.scss';
  @import '~bootstrap/scss/bootstrap.scss';
  @import '~bootstrap-vue/src/index.scss';
</style>
