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

