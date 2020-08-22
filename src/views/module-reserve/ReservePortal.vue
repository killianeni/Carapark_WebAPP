<template>
  <div class="reserve-portal-page container-custom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 mt-3 mb-3">
          <h3>Choix du site :</h3>
        </div>
      </div>
      <AppSite :data-sites="items" type-page="reservation" ></AppSite>
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
    data() {
      return {
        items: [
          {
            id: 1,
            libelle: 'Nantes',
            nbReservation: 10
          },
          {
            id: 2,
            libelle: 'Paris',
            nbReservation: 4
          },
          {
            id: 3,
            libelle: 'Rennes',
            nbReservation: 3
          },
          {
            id: 4,
            libelle: 'Tours',
            nbReservation: 5
          },
          {
            id: 5,
            libelle: 'Lille',
            nbReservation: 6
          },
        ]
      }
    }
  };
</script>

<style scoped lang="scss">

</style>

