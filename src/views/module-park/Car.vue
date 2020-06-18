<template>
  <div class="site-park-page container-custom">
    <div class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-2 mt-3 mb-3">
          <router-link :to="{ name: 'SitePark' }" class="btn btn-primary">
            <i class="kmap-icons icon-back mr-2"></i>
            Retour
          </router-link>
        </div>
        <div class="col-2 text-right mt-3 mb-3">
          <b-button variant="primary" v-b-modal.modal-car>
            <i class="kmap-icons icon-edit mr-2"></i>
            Ajouter une voiture
          </b-button>
        </div>
      </div>
      <div class="table-car">
        <b-table striped hover :items="cars" :fields="fields"></b-table>
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
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Numéro de matricule"
          label-for="car-matricule"
          invalid-feedback=""
        >
          <b-form-input
            id="car-matricule"
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
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Places"
          label-for="car-places">
          <b-form-select
            id="car-places"
            :options="nbPlaces"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          label="Portes"
          label-for="car-portes">
          <b-form-select
            id="car-portes"
            :options="nbPortes"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          label="Type de carburant"
          label-for="car-carburant">
          <b-form-select
            id="car-carburant"
            :options="typeCarburant"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox value="true">Actif</b-form-checkbox>
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
        nbPlaces: [
          { text: '-', value: null },
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
        ],
        nbPortes: [
          { text: '-', value: null },
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
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
        cars: [
          { numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: '4', nb_portes: '5', type_carburant: 'essence', actif: true },
          { numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: '3', nb_portes: '4', type_carburant: 'diesel', actif: true },
          { numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: '5', nb_portes: '6', type_carburant: 'hybride', actif: true },
          { numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: '2', nb_portes: '3', type_carburant: 'diesel', actif: true },
          { numero_matricule: 'AA-999-AA', modele_voiture: 'peugeot', nb_places: '4', nb_portes: '5', type_carburant: 'electrique', actif: true },
        ]
       }
    }
  };
</script>

<style scoped lang="scss">

</style>

