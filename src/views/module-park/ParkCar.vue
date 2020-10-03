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
                  <b-button variant="primary" :disabled="!filterCar" @click="filterCar = ''">Effacer</b-button>
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
              <b-button variant="primary" @click="updateCar(item)">
                <i class="kmap-icons icon-edit"></i>
              </b-button>
              <b-button variant="danger" @click="removeCar(item)">
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
        <b-form-group
          label="Clé 1"
          label-for="car-cle-a"
          invalid-feedback=""
        >
          <b-form-input
            id="car-cle-a"
            v-model="form.cleA"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Clé 2"
          label-for="car-cle-b"
          invalid-feedback=""
        >
          <b-form-input
            id="car-cle-b"
            v-model="form.cleB"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            value="true"
            v-model="form.actif"
          >
            Actif
            <i class="kmap-icons icon-info" :id="'info-car'"></i>
          </b-form-checkbox>
          <b-popover
            :target="'info-car'"
            triggers="hover"
            placement="bottom"
          >
            <template v-slot:title>Informations</template>
            Actif = Vehicule en état de fonctionnement<br>
            NonActif = Vehicule en mauvais état et donc retiré de la sélection
          </b-popover>
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
        cleA: '',
        cleB: '',
        actif: null
      },
      nbPlaces: [
        {text: '-', value: null},
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3},
        {text: '4', value: 4},
        {text: '5', value: 5},
        {text: '6', value: 6},
      ],
      nbPortes: [
        {text: '-', value: null},
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3},
        {text: '4', value: 4},
        {text: '5', value: 5},
        {text: '6', value: 6},
      ],
      typeCarbu: [
        {text: '-', value: null},
        {text: 'Essence', value: 'Essence'},
        {text: 'Diesel', value: 'Diesel'},
        {text: 'Électrique', value: 'Electrique'},
        {text: 'Hybride', value: 'Hybride'},
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
          key: 'cles[0].libelle',
          label: 'Clé A',
          sortable: true,
        },
        {
          key: 'cles[1].libelle',
          label: 'Clé B',
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
      idSite: this.$route.params.id,
      token: localStorage.getItem('user-token'),
      action: 'post'
    }
  },
  mounted() {
    this.getCars();
    this.totalRows = this.items.length
  },
  methods: {
    async getCars() {
      this.items = await api.url(`/api/Vehicules/GetVehiculesbySite/${this.idSite}`)
        .headers({"Authorization": "Bearer " + this.token})
        .get()
        .json();
    },
    async postCar() {
      this.form.idSite = this.idSite;
      this.form.actif = !!this.form.actif;
      this.form.cles = [];
      this.form.cles.push({"libelle": this.form.cleA});
      this.form.cles.push({"libelle": this.form.cleB});
      const body = JSON.stringify(this.form);
      await api.url('/api/Vehicules')
        .headers({
          "Authorization": "Bearer " + this.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        })
        .post(body);
      await this.getCars();
    },
    async putCar() {
      this.form.idSite = this.idSite;
      this.form.actif = !!this.form.actif;
      this.form.cles = [];
      this.form.cles.push({"id": this.form.idCleA, "libelle": this.form.cleA});
      this.form.cles.push({"id": this.form.idCleB, "libelle": this.form.cleB});
      const body = JSON.stringify(this.form);
      await api.url(`/api/Vehicules/${this.form.idVehicule}`)
        .headers({
          "Authorization": "Bearer " + this.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        })
        .put(body);
      await this.getCars();
    },
    async deleteCar(idVehicule) {
      // await api.url(`/api/Vehicules/${idVehicule}`)
      //   .headers({"Authorization": "Bearer " + this.token})
      //   .delete();
      console.log(idVehicule);
      await this.getCars();
    },
    async okCar(bvModalEvt) {
      bvModalEvt.preventDefault();
      await this.submitCar()
    },
    async submitCar() {
      if (!(this.action === 'put')) await this.postCar();
      else await this.putCar();
      await this.getCars();
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
      this.form.cleA = '';
      this.form.cleB = '';
      this.form.actif = null;
      this.action = 'post';
    },
    updateCar(item) {
      this.action = 'put';
      this.$bvModal.show("modal-car");
      this.form.idVehicule = item.id;
      this.form.numImmat = item.numImmat;
      this.form.modele = item.modele;
      this.form.nbPlaces = item.nbPlaces;
      this.form.nbPortes = item.nbPortes;
      this.form.typeCarbu = item.typeCarbu;
      this.form.idCleA = item.cles[0].id;
      this.form.cleA = item.cles[0].libelle;
      this.form.idCleB = item.cles[1].id;
      this.form.cleB = item.cles[1].libelle;
      this.form.actif = item.actif;
    },
    removeCar(item) {
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
        .then(async value => {
          if (value) await this.deleteCar(item.id);
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
