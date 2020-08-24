<template>
  <div class="user-portal-page container-custom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 mt-3 mb-3">
          <h3>Choix du site :</h3>
        </div>
      </div>
      <AppSite :data-sites="siteByCompany" type-page="user"></AppSite>
    </div>
  </div>
</template>

<script>
  import AppSite from '@/components/app-site/AppSite.vue';
  import {mapGetters} from "vuex";

  export default {
    name: 'UserPortal',
    components: {
      AppSite
    },
    computed: {
      ...mapGetters(['siteByCompany'])
    }
  };
</script>

<style scoped lang="scss">

</style>

