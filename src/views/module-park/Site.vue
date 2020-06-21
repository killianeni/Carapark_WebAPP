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
                Site - {{ item.libelle }}
              </b-card-title>
              <b-card-text>
                Nombre de voitures : {{ item.nbVoiture }}
              </b-card-text>
              <div class="text-right">
                <b-button-group>
                  <router-link :to="{ name: 'CarPark', params: { id: item.id }}" class="btn btn-dark">
                    <i class="kmap-icons icon-see"></i>
                  </router-link>
                  <b-button variant="primary" @click="editSite(item)">
                    <i class="kmap-icons icon-edit"></i>
                  </b-button>
                  <b-button variant="danger" @click="deleteSite(item)">
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
      @hidden="resetModal"
      @ok="okSite"
    >
      <form ref="form" @submit.stop.prevent="submitSite">
        <b-form-group
          label="Libelle"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            v-model="form.libelle"
            required
          ></b-form-input>
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
        form: {
          libelle: ''
        },
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
    },
    methods: {
      okSite(bvModalEvt) {
        bvModalEvt.preventDefault();
        this.submitSite()
      },
      submitSite() {
        console.log(JSON.stringify(this.form));
        this.$nextTick(() => {
          this.$bvModal.hide('modal-site')
        })
      },
      resetModal() {
        this.form.libelle = ''
      },
      editSite(item) {
        this.$bvModal.show("modal-site");
        this.form.libelle = item.libelle;
        console.log(item);
      },
      deleteSite(item) {
        this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez supprimer ce site et toutes les voitures associées.', {
          title: 'Veuillez confirmer',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'primary',
          cancelVariant: 'danger',
          okTitle: 'Valider',
          cancelTitle: 'Annuler',
          footerClass: 'p-2',
          hideHeaderClose: false,
        })
          .then(value => {
            console.log(value);
            console.log(item);
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
  };
</script>

<style scoped lang="scss">

</style>

