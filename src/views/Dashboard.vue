<template>
  <div class="dashboard">
    <Navbar/>
  </div>
</template>

<script>
  import Navbar from '@/components/app-navbar/Navbar.vue';

  export default {
    name: 'Dashboard',
    components: {
      Navbar
    }
  };
</script>
