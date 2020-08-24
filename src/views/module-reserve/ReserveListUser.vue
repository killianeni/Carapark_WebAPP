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
          <b-button variant="primary" v-b-modal.modal-reservation>
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
          <template v-slot:cell(dateStart)="{item}">
            {{ customDate(item.dateStart,item.reserveTimeStart) }}
          </template>
          <template v-slot:cell(dateEnd)="{item}">
            {{ customDate(item.dateEnd,item.reserveTimeEnd) }}
          </template>
          <template v-slot:cell(passagers)="{item}">
            <b-avatar-group variant="primary">
              <b-avatar :title="customAvatar(p)" v-for="(p, idxP) in item.passagers" v-bind:key="idxP"></b-avatar>
            </b-avatar-group>
          </template>
          <template v-slot:cell(status)="{item}">
            <b-badge v-if="item.status === 1" variant="warning">En attente</b-badge>
            <b-badge v-if="item.status === 2" variant="success">Validé</b-badge>
            <b-badge v-if="item.status === 3" variant="danger">Rejeté</b-badge>
          </template>
          <template v-slot:cell(actions)="{item}">
            <b-button-group>
              <b-button variant="primary" @click="editReserveModal(item)">
                <i class="kmap-icons icon-edit" v-if="item.status === 1"></i>
                <i class="kmap-icons icon-see" v-else></i>
              </b-button>
              <b-button v-if="item.status !== 3" variant="danger" @click="deleteReserveModal(item)">
                <i class="kmap-icons icon-delete"></i>
              </b-button>
              <b-button v-if="item.status === 3" variant="danger" @click="seeReserveModal(item)">
                <i class="kmap-icons icon-startFlag"></i>
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
  </div>
</template>

<script>
  import moment from 'moment';
  import AppReservation from '@/components/app-reservation/AppReservation.vue';

  export default {
    name: 'ReserveListUser',
    components: {
      AppReservation
    },
    data() {
      return {
        fields: [
          {
            key: 'dateStart',
            label: 'Date Début',
            sortable: true,
          },
          {
            key: 'dateEnd',
            label: 'Date de Fin',
            sortable: true,
          },
          {
            key: 'passagers',
            label: 'Passagers',
            sortable: true,
          },
          {
            key: 'destination',
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
        items: [
          {
            id: 1,
            dateStart: '20200701',
            reserveTimeStart: 'PM',
            dateEnd: '20200705',
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Michels',
              prenom: 'Toto',
              mail: 'michels.toto@eni.fr',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 1,
            passagers: [
              {id: 1, nom: 'Andrews ', prenom: 'Baxter', site: 1},
              {id: 2, nom: 'Burke ', prenom: 'Mcfadden', site: 1},
            ],
            destination: 'Rennes',
            description: 'RU client',
            commentaire: '',
            status: 1
          },
          {
            id: 2,
            dateStart: '20200702',
            reserveTimeStart: 'AM',
            dateEnd: '20200703',
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Thomas',
              prenom: 'Tata',
              mail: 'thomas.tata@eni.fr',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 2,
            passagers: [
              {id: 3, nom: 'Flynn ', prenom: 'Barnes', site: 1},
              {id: 4, nom: 'Dorsey ', prenom: 'Blackwell', site: 1},
            ],
            destination: 'Paris',
            description: 'RU client',
            commentaire: '',
            status: 2
          },
          {
            id: 3,
            dateStart: '20200703',
            reserveTimeStart: 'AM',
            dateEnd: '20200705',
            reserveTimeEnd: 'AM',
            utilisateur: {
              id: 1,
              nom: 'Matt',
              prenom: 'Rouge',
              mail: 'matt.rouge@eni.fr',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 2,
            passagers: [
              {id: 3, nom: 'Fddm ', prenom: 'Arnes', site: 1},
              {id: 4, nom: 'Rorsey ', prenom: 'Lackwell', site: 1},
            ],
            destination: 'Paris',
            description: 'RU client',
            commentaire: 'Réservation rejeter',
            status: 3
          },
        ],
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
        this.$refs.formReservation.deleteModalReserve(reserve);
      },
      seeReserveModal(reserve) {
        this.$refs.formReservation.editModalAnnuler(reserve);
      }
    },
    mounted() {
      this.totalRows = this.items.length
    },
  };
</script>

<style scoped lang="scss">

</style>

