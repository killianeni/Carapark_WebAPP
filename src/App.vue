<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script>
  import Navbar from '@/components/app-navbar/Navbar.vue'

  export default {
    name: 'app',
    components: {
      Navbar
    }
  }
</script>

<style lang="scss" rel="stylesheet">
  @import "assets/sass/style.scss";
  @import '~bootstrap/scss/bootstrap.scss';
  @import '~bootstrap-vue/src/index.scss';
</style>
