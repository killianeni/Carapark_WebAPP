<template>
  <div class="park-portal-page container-custom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-6 mt-3 mb-3">
          <h3>Choix du site :</h3>
        </div>
        <div class="col-6 text-right mt-3 mb-3">
          <b-button variant="primary" v-b-modal.modal-site>
            <i class="kmap-icons icon-add mr-2"></i>
            Ajouter un site
          </b-button>
        </div>
      </div>
      <AppSite type-page="park"></AppSite>
    </div>
  </div>
</template>

<script>
  import AppSite from '@/components/app-site/AppSite.vue';

  export default {
    name: 'ParkPortal',
    components: {
      AppSite
    },
  };
</script>

<style scoped lang="scss">

</style>

