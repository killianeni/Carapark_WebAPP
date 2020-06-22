<template>
  <div class="user-portal-page container-custom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 mt-3 mb-3">
          <h3>Choix du site :</h3>
        </div>
      </div>
      <AppSite :data-sites="items" type-page="user" ></AppSite>
    </div>
  </div>
</template>

<script>
  import AppSite from '@/components/app-site/AppSite.vue';

  export default {
    name: 'UserPortal',
    components: {
      AppSite
    },
    data() {
      return {
        items: [
          {
            id: 1,
            libelle: 'Nantes',
            nbUtilisateur: 10
          },
          {
            id: 2,
            libelle: 'Paris',
            nbUtilisateur: 4
          },
          {
            id: 3,
            libelle: 'Rennes',
            nbUtilisateur: 3
          },
          {
            id: 4,
            libelle: 'Tours',
            nbUtilisateur: 5
          },
          {
            id: 5,
            libelle: 'Lille',
            nbUtilisateur: 6
          },
        ]
      }
    }
  };
</script>

<style scoped lang="scss">

</style>

