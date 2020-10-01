<template>
  <div class="reserve-my-page container-custom">
    <div class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-4 col-md-6 mt-3 mb-3">
          <router-link :to="{ name: 'Dashboard' }" class="btn btn-primary">
            <i class="kmap-icons icon-back mr-2"></i>
            Retour
          </router-link>
        </div>
        <div class="col-8 col-md-6 text-right mt-3 mb-3">
          <b-button variant="primary" @click="addReserveModal">
            <i class="kmap-icons icon-add mr-2"></i>
            Ajouter une réservation
          </b-button>
        </div>
      </div>
      <div class="table-my-reserve">
        <div class="container-fluid">
          <div class="container-fluid">
            <div class="row justify-content-between">
              <div class="col-12 col-md-4 mt-3 mb-3">
                <b-input-group>
                  <b-form-input
                    v-model="filterReservation"
                    type="search"
                    id="filterInput"
                    placeholder="Rechercher"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" :disabled="!filterReservation" @click="filterReservation = ''">Effacer
                    </b-button>
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
        </div>
        <b-table
          striped
          hover
          :items="items"
          :fields="fields"
          stacked="md"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filterReservation">
          <template v-slot:cell(dateDebut)="{item}">
            {{ customDate(item.dateDebut,item.timeStart) }}
          </template>
          <template v-slot:cell(dateFin)="{item}">
            {{ customDate(item.dateFin,item.timeEnd) }}
          </template>
          <template v-slot:cell(vehicule)="{item}">
            {{ item.vehicule.modele }} -  {{ item.vehicule.nbPlaces }} Places
          </template>
          <template v-slot:cell(personnels)="{item}">
            <b-avatar-group variant="primary">
              <b-avatar :title="customAvatar(p)" v-for="(p, idxP) in item.personnels" v-bind:key="idxP"></b-avatar>
            </b-avatar-group>
          </template>
          <template v-slot:cell(status)="{item}">
            <b-badge v-if="item.status === 1" variant="warning">En attente</b-badge>
            <b-badge v-if="item.status === 2" variant="success">Validé</b-badge>
            <b-badge v-if="item.status === 3" variant="danger">Rejeté</b-badge>
            <b-badge v-if="item.status === 4" variant="dark">Clôturé</b-badge>
          </template>
          <template v-slot:cell(actions)="{item}">
            <b-button-group>
              <b-button variant="primary" @click="editReserveModal(item)">
                <i class="kmap-icons icon-edit" v-if="item.status === 1"></i>
                <i class="kmap-icons icon-see" v-else></i>
              </b-button>
              <b-button v-if="item.status < 3" variant="danger" @click="deleteReserveModal(item)">
                <i class="kmap-icons icon-false"></i>
              </b-button>
              <b-button v-if="item.status >= 1" variant="info" @click="notificationReserveModal(item)">
                <i class="kmap-icons icon-message"></i>
              </b-button>
            </b-button-group>
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
    <AppReservation ref="formReservation"></AppReservation>
    <AppReservationAction ref="formReservationAction"></AppReservationAction>
  </div>
</template>

<script>
  import moment from 'moment';
  import AppReservation from '@/components/app-reservation/AppReservation.vue';
  import AppReservationAction from '@/components/app-reservation-action/AppReservationAction.vue';
  import {mapGetters} from 'vuex';
  import {api} from '@/config';

  export default {
    name: 'ReserveListUser',
    components: {
      AppReservation,
      AppReservationAction
    },
    data() {
      return {
        fields: [
          {
            key: 'dateDebut',
            label: 'Date Début',
            sortable: true,
          },
          {
            key: 'dateFin',
            label: 'Date de Fin',
            sortable: true,
          },
          {
            key: 'vehicule',
            label: 'Véhicule',
            sortable: true,
          },
          {
            key: 'personnels',
            label: 'Personnels',
            sortable: true,
          },
          {
            key: 'siteDestination',
            label: 'Destination',
            sortable: true,
          },
          {
            key: 'description',
            label: 'Description',
            sortable: true,
          },
          {
            key: 'status',
            label: 'Status',
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
        filterReservation: null,
      }
    },
    methods: {
      customAvatar(p) {
        return `${p.nom} – ${p.prenom}`;
      },
      customDate(date,reserveTime){
        let d = moment(date).format('DD/MM/YYYY');
        let t = reserveTime === 'AM' ? 'Matin'  : 'Après midi';

        return d + " - " + t;
      },
      editReserveModal(reserve) {
        this.$refs.formReservation.editModalReserve(reserve);
      },
      deleteReserveModal(reserve) {
        this.$refs.formReservationAction.deleteModalReserve(reserve);
      },
      notificationReserveModal(reserve) {
        this.$refs.formReservationAction.infoModalNotification(reserve,'reserve');
      },
      addReserveModal() {
        this.$refs.formReservation.addModalReserve();
      },
      async getReservationsByUser() {
        const userId = this.userLogged.id;
        const token = localStorage.getItem('user-token');
        await api.url(`/api/Reservations/GetReservationsByUser/${userId}`)
          .headers({"Authorization": "Bearer " + token})
          .get()
          .json()
          .then(data => {
            this.items = data;
            this.totalRows = data.length;
          });
      },
    },
    computed: {
      ...mapGetters(['userLogged']),
    },
    mounted() {
      this.getReservationsByUser();
    },
  };
</script>

<style scoped lang="scss">

</style>

