<template>
  <div class="portal-park-page container-custom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 text-right mt-3 mb-3">
          <b-button variant="primary" v-b-modal.modal-site>
            <i class="kmap-icons icon-edit mr-2"></i>
            Ajouter un site
          </b-button>
        </div>
        <div class="col-12 col-md-4" v-for="(item) in items" :key="item.site">
            <b-card bg-variant="light" class="mb-3">
              <b-card-title>
                Site {{ item.siteId }}
              </b-card-title>
              <b-card-text>
                Nombre de voitures : {{ item.nbVoiture }}
              </b-card-text>
              <div class="text-right">
                <b-button-group>
                  <router-link :to="{ name: 'CarPark', params: { id: item.siteId }}" class="btn btn-dark">
                    <i class="kmap-icons icon-see"></i>
                  </router-link>
                  <b-button variant="primary">
                    <i class="kmap-icons icon-edit"></i>
                  </b-button>
                  <b-button variant="danger">
                    <i class="kmap-icons icon-delete"></i>
                  </b-button>
                </b-button-group>
              </div>
            </b-card>
        </div>
      </div>
    </div>
    <b-modal
      id="modal-site"
      ref="modal"
      title="Ajouter un site"
      cancel-title="Annuler"
      ok-title="Valider"
      cancel-variant="danger"
      ok-variant="primary"
      header-bg-variant="light"
      body-bg-variant="light"
      footer-bg-variant="light"
    >
      <!--@show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"-->
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <!--:state="nameState"-->
        <b-form-group
          label="Libelle"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            required
          ></b-form-input>
          <!--v-model="name"
          :state="nameState"-->
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'SitePark',
    data() {
      return {
        items: [
          {
            siteId: '1',
            nbVoiture: '10'
          },
          {
            siteId: '2',
            nbVoiture: '4'
          },
          {
            siteId: '3',
            nbVoiture: '3'
          },
          {
            siteId: '4',
            nbVoiture: '5'
          },
          {
            siteId: '5',
            nbVoiture: '6'
          },
        ]
      }
    }
  };
</script>

<style scoped lang="scss">

</style>

