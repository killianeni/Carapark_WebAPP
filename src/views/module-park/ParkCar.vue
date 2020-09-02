<template>
  <div class="park-car-page container-custom">
    <div class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-6 mt-3 mb-3">
          <router-link :to="{ name: 'ParkPortal' }" class="btn btn-primary">
            <i class="kmap-icons icon-back mr-2"></i>
            Retour
          </router-link>
        </div>
        <div class="col-6 text-right mt-3 mb-3">
          <b-button variant="primary" v-b-modal.modal-car>
            <i class="kmap-icons icon-add mr-2"></i>
            Ajouter une voiture
          </b-button>
        </div>
      </div>
      <div class="table-car">
        <div class="container-fluid">
          <div class="row justify-content-between">
            <div class="col-12 col-md-4 mt-3 mb-3">
              <b-input-group>
                <b-form-input
                  v-model="filterCar"
                  type="search"
                  id="filterInput"
                  placeholder="Rechercher"
                ></b-form-input>
                <b-input-group-append>
                  <b-button  variant="primary" :disabled="!filterCar" @click="filterCar = ''">Effacer</b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="col-12 col-md-4 mt-3 mb-3">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                size="md"
                class="my-0 justify-content-end"
              ></b-pagination>
            </div>
          </div>
        </div>
        <b-table
          striped
          hover
          :items="items"
          :fields="fields"
          stacked="md"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filterCar">
          <template v-slot:cell(actions)="{item}">
            <b-button-group>
              <b-button variant="primary" @click="editCar(item)">
                <i class="kmap-icons icon-edit"></i>
              </b-button>
              <b-button variant="danger" @click="deleteCar(item)">
                <i class="kmap-icons icon-delete"></i>
              </b-button>
            </b-button-group>
          </template>
          <template v-slot:cell(actif)="{item}">
            {{ item.actif ? 'Oui' : 'Non' }}
          </template>
        </b-table>
        <div class="container-fluid d-md-none">
          <div class="row justify-content-end">
            <div class="col-12 col-md-4 mt-3 mb-3">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                size="md"
                class="my-0 justify-content-end"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      id="modal-car"
      ref="modal"
      title="Ajouter une voiture"
      cancel-title="Annuler"
      ok-title="Valider"
      cancel-variant="danger"
      ok-variant="primary"
      header-bg-variant="light"
      body-bg-variant="light"
      footer-bg-variant="light"
      @hidden="resetModalCar"
      @ok="okCar"
      centered
    >
      <form ref="form" @submit.stop.prevent="submitCar">
        <b-form-group
          label="Numéro de matricule"
          label-for="car-matricule"
          invalid-feedback=""
        >
          <b-form-input
            id="car-matricule"
            v-model="form.numImmat"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Modèle de la voiture"
          label-for="car-modele"
          invalid-feedback=""
        >
          <b-form-input
            id="car-modele"
            v-model="form.modele"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Places"
          label-for="car-places">
          <b-form-select
            id="car-places"
            v-model="form.nbPlaces"
            :options="nbPlaces"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          label="Portes"
          label-for="car-portes">
          <b-form-select
            id="car-portes"
            v-model="form.nbPortes"
            :options="nbPortes"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          label="Type de carburant"
          label-for="car-carburant">
          <b-form-select
            id="car-carburant"
            v-model="form.typeCarbu"
            :options="typeCarbu"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            value="true"
            v-model="form.actif"
          >
            Actif
          </b-form-checkbox>
        </b-form-group>
      </form>
    </b-modal>

  </div>
</template>

<script>
  import {api} from "@/config";

  export default {
    name: 'ParkCar',
    data() {
      return {
        form: {
          numImmat: '',
          modele: '',
          nbPlaces: '',
          nbPortes: '',
          typeCarbu: '',
          actif: null
        },
        nbPlaces: [
          { text: '-', value: null },
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
          { text: '6', value: 6 },
        ],
        nbPortes: [
          { text: '-', value: null },
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
          { text: '6', value: 6 },
        ],
        typeCarbu: [
          { text: '-', value: null },
          { text: 'Essence', value: 'essence' },
          { text: 'Diesel', value: 'diesel' },
          { text: 'Électrique', value: 'electrique' },
          { text: 'Hybride', value: 'hybride' },
        ],
        fields: [
          {
            key: 'numImmat',
            label: 'Numéro de matricule',
            sortable: true,
          },
          {
            key: 'modele',
            label: 'Modèle de la voiture',
            sortable: true,
          },
          {
            key: 'nbPlaces',
            label: 'Nombre de places',
            sortable: true,
          },
          {
            key: 'nbPortes',
            label: 'Nombre de portes',
            sortable: true,
          },
          {
            key: 'typeCarbu',
            label: 'Type de carburant',
            sortable: true,
          },
          {
            key: 'actif',
            label: 'Actif',
            sortable: true,
          },
          {
            key: 'actions',
            label: 'Actions'
          },
        ],
        items: [],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        filterCar: null,
       }
    },
    mounted() {
      this.getCars();
      this.totalRows = this.items.length
    },
    methods: {
      async getCars(){
        const idSite = this.$route.params.id;
        const token = localStorage.getItem('user-token');
        this.items = await api.url(`/api/Vehicules/GetVehiculesbySite/${idSite}`)
          .headers({"Authorization": "Bearer " + token})
          .get()
          .json();
      },
      async postCar(){
        console.log(JSON.stringify(this.form));
        // const body = JSON.stringify(this.form);
        // await api.url('/api/Sites')
        //   .headers({"Content-Type": "application/json", Accept: "application/json"})
        //   .post(body).json();
      },
      okCar(bvModalEvt) {
        bvModalEvt.preventDefault();
        this.submitCar()
      },
      submitCar() {
        this.postCar();
        this.getCars();
        this.$nextTick(() => {
          this.$bvModal.hide('modal-car')
        })
      },
      resetModalCar() {
          this.form.numImmat = '';
          this.form.modele = '';
          this.form.nbPlaces = '';
          this.form.nbPortes = '';
          this.form.typeCarbu = '';
          this.form.actif = null
      },
      editCar(item) {
        this.$bvModal.show("modal-car");
        this.form.numImmat = item.numImmat;
        this.form.modele = item.modele;
        this.form.nbPlaces = item.nbPlaces;
        this.form.nbPortes = item.nbPortes;
        this.form.typeCarbu = item.typeCarbu;
        this.form.actif = item.actif;
      },
      deleteCar(item) {
        this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez supprimer cette voiture.', {
          title: 'Veuillez confirmer',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'primary',
          cancelVariant: 'danger',
          okTitle: 'Valider',
          cancelTitle: 'Annuler',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
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

