<template>
  <div class="site-park-page container-custom">
    <div class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-6 mt-3 mb-3">
          <router-link :to="{ name: 'SitePark' }" class="btn btn-primary">
            <i class="kmap-icons icon-back mr-2"></i>
            Retour
          </router-link>
        </div>
        <div class="col-6 text-right mt-3 mb-3">
          <b-button variant="primary" v-b-modal.modal-car>
            <i class="kmap-icons icon-edit mr-2"></i>
            Ajouter une voiture
          </b-button>
        </div>
      </div>
      <div class="table-car">
        <b-table striped hover :items="items" :fields="fields" stacked="md">
          <template v-slot:cell(actions)="{item}">
            <b-button-group>
              <b-button variant="primary" @click="editeCar(item)">
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
      @hidden="resetModal"
      @ok="okCar"
    >
      <form ref="form" @submit.stop.prevent="submitCar">
        <b-form-group
          label="Numéro de matricule"
          label-for="car-matricule"
          invalid-feedback=""
        >
          <b-form-input
            id="car-matricule"
            v-model="form.numero_matricule"
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
            v-model="form.modele_voiture"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Places"
          label-for="car-places">
          <b-form-select
            id="car-places"
            v-model="form.nb_places"
            :options="nbPlaces"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          label="Portes"
          label-for="car-portes">
          <b-form-select
            id="car-portes"
            v-model="form.nb_portes"
            :options="nbPortes"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          label="Type de carburant"
          label-for="car-carburant">
          <b-form-select
            id="car-carburant"
            v-model="form.type_carburant"
            :options="typeCarburant"
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
  export default {
    name: 'CarPark',
    data() {
      return {
        form: {
          numero_matricule: '',
          modele_voiture: '',
          nb_places: '',
          nb_portes: '',
          type_carburant: '',
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
        typeCarburant: [
          { text: '-', value: null },
          { text: 'Essence', value: 'essence' },
          { text: 'Diesel', value: 'diesel' },
          { text: 'Électrique', value: 'electrique' },
          { text: 'Hybride', value: 'hybride' },
        ],
        fields: [
          {
            key: 'numero_matricule',
            label: 'Numéro de matricule',
            sortable: true,
          },
          {
            key: 'modele_voiture',
            label: 'Modèle de la voiture',
            sortable: true,
          },
          {
            key: 'nb_places',
            label: 'Nombre de places',
            sortable: true,
          },
          {
            key: 'nb_portes',
            label: 'Nombre de portes',
            sortable: true,
          },
          {
            key: 'type_carburant',
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
        items: [
          { id: 1, numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: 4, nb_portes: 5, type_carburant: 'essence', actif: true },
          { id: 2, numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: 4, nb_portes: 4, type_carburant: 'diesel', actif: false },
          { id: 3, numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: 5, nb_portes: 6, type_carburant: 'hybride', actif: true },
          { id: 4, numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: 2, nb_portes: 3, type_carburant: 'diesel', actif: true },
          { id: 5, numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: 4, nb_portes: 5, type_carburant: 'electrique', actif: false },
        ]
       }
    },
    methods: {
      okCar(bvModalEvt) {
        bvModalEvt.preventDefault();
        this.submitCar()
      },
      submitCar() {
        console.log(JSON.stringify(this.form));
        this.$nextTick(() => {
          this.$bvModal.hide('modal-car')
        })
      },
      resetModal() {
          this.form.numero_matricule = '';
          this.form.modele_voiture = '';
          this.form.nb_places = '';
          this.form.nb_portes = '';
          this.form.type_carburant = '';
          this.form.actif = null
      },
      editeCar(item) {
        this.$bvModal.show("modal-car");
        this.form.numero_matricule = item.numero_matricule;
        this.form.modele_voiture = item.modele_voiture;
        this.form.nb_places = item.nb_places;
        this.form.nb_portes = item.nb_portes;
        this.form.type_carburant = item.type_carburant;
        this.form.actif = item.actif;
        console.log(item);
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

