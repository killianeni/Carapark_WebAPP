<template>
  <div class="reserve-portal-page container-custom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 mt-3 mb-3">
          <h3>Choix du site :</h3>
        </div>
      </div>
      <AppSite type-page="reservation" ></AppSite>
    </div>
  </div>
</template>

<script>
  import AppSite from '@/components/app-site/AppSite.vue';

  export default {
    name: 'ReservePortal',
    components: {
      AppSite
    },
  };
</script>

<style scoped lang="scss">

</style>

