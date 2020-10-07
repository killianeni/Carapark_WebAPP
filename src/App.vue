<template>
  <main id="app">
    <AppNavbar />
    <AppToast ref="appToast" />
    <AppProfil ref="appProfil" />
    <router-view />
  </main>
</template>

<script>
  import { USER_REQUEST} from './store/actions/user';
  import AppNavbar from '@/components/app-navbar/AppNavbar.vue';
  import AppToast from '@/components/app-toast/AppToast.vue';
  import AppProfil from '@/components/app-profil/AppProfil.vue';

  export default {
    name: 'App',
    created: function() {
      if (this.$store.getters.isAuthenticated) {
        this.$store.dispatch(USER_REQUEST);
      }
    },
    components: {
      AppNavbar,
      AppToast,
      AppProfil
    }
  };
</script>

<style lang="scss" rel="stylesheet">
  @import 'assets/sass/style.scss';
  @import '~bootstrap/scss/bootstrap.scss';
  @import '~bootstrap-vue/src/index.scss';
</style>
