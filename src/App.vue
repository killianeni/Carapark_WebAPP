<template>
  <main id="app">
    <AppNavbar/>
    <AppToast ref="appToast"/>
    <router-view/>
  </main>
</template>

<script>
  import { USER_REQUEST} from './store/actions/user';
  import AppNavbar from '@/components/app-navbar/AppNavbar.vue';
  import AppToast from '@/components/app-toast/AppToast.vue';

  export default {
    name: 'app',
    created: function() {
      if (this.$store.getters.isAuthenticated) {
        this.$store.dispatch(USER_REQUEST);
      }
    },
    components: {
      AppNavbar,
      AppToast
    }
  }
</script>

<style lang="scss" rel="stylesheet">
  @import 'assets/sass/style.scss';
  @import '~bootstrap/scss/bootstrap.scss';
  @import '~bootstrap-vue/src/index.scss';
</style>
