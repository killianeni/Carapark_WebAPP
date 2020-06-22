<template>
  <div class="park-portal-page container-custom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-6 mt-3 mb-3">
          <h3>Choix du site :</h3>
        </div>
        <div class="col-6 text-right mt-3 mb-3">
          <b-button variant="primary" v-b-modal.modal-site>
            <i class="kmap-icons icon-edit mr-2"></i>
            Ajouter un site
          </b-button>
        </div>
      </div>
      <AppSite :data-sites="items" type-page="park"></AppSite>
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
    data() {
      return {
        items: [
          {
            id: 1,
            libelle: 'Nantes',
            nbVoiture: 10
          },
          {
            id: 2,
            libelle: 'Paris',
            nbVoiture: 4
          },
          {
            id: 3,
            libelle: 'Rennes',
            nbVoiture: 3
          },
          {
            id: 4,
            libelle: 'Tours',
            nbVoiture: 5
          },
          {
            id: 5,
            libelle: 'Lille',
            nbVoiture: 6
          },
        ]
      }
    }
  };
</script>

<style scoped lang="scss">

</style>

