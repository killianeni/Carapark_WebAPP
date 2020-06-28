<template>
  <div>
    <div v-if="isAuthenticated">
      <div class="dashboard-page container-custom">
        <div class="container-fluid">
          <div class="calendar">
            <div class="month">
              <b-button variant="primary" class="rounded-circle" @click="subtractMonth">
                <i class="kmap-icons icon-back" />
              </b-button>
              <h3 class="month-title">
                {{ month + ' - ' + year }}
              </h3>
              <b-button variant="primary" class="rounded-circle" @click="addMonth">
                <i class="kmap-icons icon-next" />
              </b-button>
            </div>
            <div class="weekdays">
              <div class="day" v-for="(day, indexDay) in days" v-bind:key="indexDay">
                <p>{{ day }}</p>
              </div>
            </div>
            <div class="dates">
              <div class="date"
                   v-for="(blank,indexBlank) in firstDayOfMonth" v-bind:key="indexBlank + '_key'"
                   :class="{ 'date-disable' : blank }"
              >
              </div>
              <div class="date" v-for="(dateR) in daysInMonthReservations" v-bind:key="dateR.day">
                <span class="container-date-number" :class="{ 'c-day' : dateR.day === initialDate && month === initialMonth && year === initialYear }">
                  <span class="date-number">
                    {{ dateR.day }}  <span class="day"> - {{ dateContext.date(dateR.day).format('dd') }}</span>
                  </span>
                </span>
                <div class="container-reservation">
                  <span class="date-reserve date-am"
                        @click="listReservationModal(dateR.date,dateR.idReserveAM,'AM')"
                        v-if="dateR.AM"
                        :class="checkSize(dateR.AM)">
                    AM - {{ dateR.AM }}/{{ maxVoitureSite }}
                  </span>
                  <span class="date-reserve date-pm"
                        @click="listReservationModal(dateR.date,dateR.idReservePM,'PM')"
                        v-if="dateR.PM"
                        :class="checkSize(dateR.PM)">
                    PM - {{ dateR.PM }}/{{ maxVoitureSite }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <b-modal
          id="modal-list-reservation"
          ref="modal-list-reservation"
          :title="cListTitleModal"
          cancel-title="Annuler"
          ok-title="Valider"
          cancel-variant="danger"
          ok-variant="primary"
          header-bg-variant="light"
          body-bg-variant="light"
          footer-bg-variant="light"
          centered
          scrollable
          hide-footer
          no-stacking
          @hidden="resetListReservation"
        >
          <div class="list-reservation">
            <b-list-group>
              <b-list-group-item
                v-for="reserve in cListReserveModal" v-bind:key="reserve.id"
                @click="editReserve(reserve)"
              >
                <div class="titreReserve">
                  <h5 class="mb-1">
                    {{ reserve.id }} {{ reserve.utilisateur.nom }} {{ reserve.utilisateur.prenom }}
                  </h5>
                  <span class="look">
                  <i class="kmap-icons icon-see"></i>
                </span>
                </div>
                <div class="targetReserve">
                  <span><i class="kmap-icons icon-startFlag"></i>{{ reserve.utilisateur.site.libelle }}</span>
                  <span><i class="kmap-icons icon-next"></i></span>
                  <span><i class="kmap-icons icon-endFlag"></i>{{ reserve.destination }}</span>
                  En cours
                </div>
              </b-list-group-item>
            </b-list-group>
          </div>
        </b-modal>

        <b-modal
          id="modal-reservation"
          :title="cTitleReserveModal"
          header-bg-variant="light"
          body-bg-variant="light"
          footer-bg-variant="light"
          cancel-title="Annuler"
          ok-title="Valider"
          cancel-variant="danger"
          ok-variant="primary"
          @hidden="resetReserve"
        >
          <form ref="form" class="user-reservation">
            <b-form-group
              label="Date"
              label-for="reserve-date"
              invalid-feedback=""
            >
              <b-form-input
                id="reserve-date"
                v-model="form.date"
                required
              ></b-form-input>
              <b-form-select
                id="reserve-reserveTime"
                v-model="form.reserveTime"
                required
              >
                <b-form-select-option :value="null" disabled>
                  -- Choix de la zone horaire --
                </b-form-select-option>
                <b-form-select-option value="AM">
                  Matin
                </b-form-select-option>
                <b-form-select-option value="PM">
                  Après-midi
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
            <b-form-group
              label="Date Fin"
              label-for="reserve-date"
              invalid-feedback=""
            >
              <b-form-input
                id="reserve-date"
                v-model="form.date"
                required
              ></b-form-input>
              <b-form-select
                id="reserve-reserveTime"
                v-model="form.reserveTime"
                required
              >
                <b-form-select-option :value="null" disabled>
                  -- Choix de la zone horaire --
                </b-form-select-option>
                <b-form-select-option value="AM">
                  Matin
                </b-form-select-option>
                <b-form-select-option value="PM">
                  Après-midi
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
            <b-form-group
              label="Voiture"
              label-for="reserve-voiture"
              invalid-feedback=""
            >
              <b-form-select
                id="reserve-voiture"
                v-model="form.idVehicule"
                value-field="id"
                text-field="modele_voiture">
                <b-form-select-option :value="null" disabled>-- Choix de la voiture --</b-form-select-option>
                <b-form-select-option v-for="(car) in vehiculeOptions" v-bind:key="car.id" :value="car.id">
                  {{ car.modele_voiture }} - {{ car.nb_places }} places
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
            <b-form-group
              label="Liste des passagers"
              label-for="reserve-passager"
              invalid-feedback=""
            >
              <multiselect
                id="reserve-passager"
                v-model="form.passagers"
                placeholder="Rechercher un utilisateur"
                label="name"
                track-by="nom"
                deselectLabel="Cliquez pour supprimer"
                selectLabel="Cliquez pour sélectionner"
                selectedLabel="Sélectionné"
                :options="passagersOptions"
                :multiple="true"
                :max=2
                :custom-label="customLabel"
                :optionsLimit=10
              >
                <template slot="option" slot-scope="props">
                  <div class="option-list-user">
                    <b-avatar variant="primary"></b-avatar>
                    <div class="nom-prenom">{{ props.option.nom }} {{ props.option.prenom }}</div>
                  </div>
                </template>
                <span slot="noResult">Aucun utilisateur trouvé</span>
                <span slot="maxElements">Voiture complète</span>
              </multiselect>
            </b-form-group>
            <b-form-group
              label="Destination"
              label-for="reserve-destination"
              invalid-feedback=""
            >
              <b-form-input
                id="reserve-destination"
                v-model="form.destination"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Description"
              label-for="reserve-description"
              invalid-feedback=""
            >
              <b-form-textarea
                id="description"
                v-model="form.description"
                rows="3"
                max-rows="4"
              ></b-form-textarea>
            </b-form-group>
          </form>
        </b-modal>
      </div>
    </div>

    <div v-if="!isAuthenticated">
      <login/>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Login from './Login';
  import moment from 'moment';
  import Multiselect from 'vue-multiselect'

  require('../store/modules/moment-locale-fr');

  export default {
    name: 'Dashboard',
    components: {
      Login,
      Multiselect
    },
    data() {
      return {
        passagersOptions: [
          {id: 1, nom: 'Andrews ', prenom: 'Baxter', site: 1},
          {id: 2, nom: 'Burke ', prenom: 'Mcfadden', site: 1},
          {id: 3, nom: 'Flynn ', prenom: 'Barnes', site: 1},
          {id: 4, nom: 'Dorsey ', prenom: 'Blackwell', site: 1},
          {id: 5, nom: 'Thelma ', prenom: 'Gay', site: 1},
          {id: 6, nom: 'Nell ', prenom: 'Silva', site: 1},
          {id: 7, nom: 'Nettie ', prenom: 'Dixon', site: 1},
          {id: 8, nom: 'Bailey ', prenom: 'Carver', site: 1},
          {id: 9, nom: 'Maryann ', prenom: 'Erickson', site: 1},
          {id: 10, nom: 'Imelda ', prenom: 'Kirk', site: 1},
          {id: 11, nom: 'Nettie ', prenom: 'Carver', site: 1},
          {id: 12, nom: 'Barnes', prenom: 'Kirk', site: 1},
          {id: 13, nom: 'Erickson ', prenom: 'Blackwell', site: 1},
          {id: 14, nom: 'Maryann ', prenom: 'Kirk', site: 1},
          {id: 15, nom: 'Silva ', prenom: 'Nettie', site: 1},
          {id: 16, nom: 'Blackwell ', prenom: 'Dorsey', site: 1},
        ],
        vehiculeOptions: [
          {id: 1, modele_voiture: 'peugeot', nb_places: 4},
          {id: 2, modele_voiture: 'renault', nb_places: 4},
          {id: 3, modele_voiture: 'nissan', nb_places: 4},
          {id: 4, modele_voiture: 'opel', nb_places: 5},
          {id: 5, modele_voiture: 'porsche', nb_places: 4},
          {id: 6, modele_voiture: 'rolls royce', nb_places: 4},
          {id: 7, modele_voiture: 'toyota', nb_places: 4},
          {id: 8, modele_voiture: 'ford', nb_places: 4},
        ],
        today: moment(),
        dateContext: moment(),
        days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        maxVoitureSite: 8,
        cListTitleModal: '',
        cListReserveModal: [],
        cTitleReserveModal: '',
        cListReservations: [],
        form: {
          date: '',
          reserveTime: '',
          idVehicule: '',
          passagers: [],
          destination: '',
          description: ''
        },
        reservations: [
          {
            id: 1,
            dateStart: moment('20200601', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200605', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Michels',
              prenom: 'Toto',
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
            status: 1
          },
          {
            id: 2,
            dateStart: moment('20200602', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200603', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Thomas',
              prenom: 'Tata',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idUtilisateur: 1,
            idVehicule: 2,
            passagers: [
              {id: 3, nom: 'Flynn ', prenom: 'Barnes', site: 1},
              {id: 4, nom: 'Dorsey ', prenom: 'Blackwell', site: 1},
            ],
            destination: 'Paris',
            description: 'RU client'
          },
          {
            id: 3,
            dateStart: moment('20200602', 'YYYYMMDD'),
            reserveTimeStart: 'PM',
            dateEnd: moment('20200603', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Dany',
              prenom: 'Bane',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 3,
            passagers: [
              {id: 5, nom: 'Thelma ', prenom: 'Gay', site: 1},
              {id: 6, nom: 'Nell ', prenom: 'Silva', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },

          {
            id: 4,
            dateStart: moment('20200605', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200605', 'YYYYMMDD'),
            reserveTimeEnd: 'AM',
            utilisateur: {
              id: 1,
              nom: 'Micky',
              prenom: 'Tino',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 4,
            passagers: [
              {id: 7, nom: 'Nettie ', prenom: 'Dixon', site: 1},
              {id: 8, nom: 'Bailey ', prenom: 'Carver', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 5,
            dateStart: moment('20200608', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200608', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Argentina',
              prenom: 'Mirel',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 5,
            passagers: [
              {id: 9, nom: 'Maryann ', prenom: 'Erickson', site: 1},
              {id: 10, nom: 'Imelda ', prenom: 'Kirk', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 6,
            dateStart: moment('20200611', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200611', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Argentina',
              prenom: 'Mirel',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 6,
            passagers: [
              {id: 11, nom: 'Nettie ', prenom: 'Carver', site: 1},
              {id: 12, nom: 'Barnes', prenom: 'Kirk', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 7,
            dateStart: moment('20200611', 'YYYYMMDD'),
            reserveTimeStart: 'PM',
            dateEnd: moment('20200611', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Argentina',
              prenom: 'Mirel',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 7,
            passagers: [
              {id: 13, nom: 'Erickson ', prenom: 'Blackwell', site: 1},
              {id: 14, nom: 'Maryann ', prenom: 'Kirk', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 8,
            dateStart: moment('20200615', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200615', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Argentina',
              prenom: 'Mirel',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 8,
            passagers: [
              {id: 15, nom: 'Silva ', prenom: 'Nettie', site: 1},
              {id: 16, nom: 'Blackwell ', prenom: 'Dorsey', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 9,
            dateStart: moment('202006116', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200616', 'YYYYMMDD'),
            reserveTimeEnd: 'AM',
            utilisateur: {
              id: 1,
              nom: 'Argentina',
              prenom: 'Mirel',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idUtilisateur: 1,
            idVehicule: 8,
            passagers: [
              {id: 15, nom: 'Silva ', prenom: 'Nettie', site: 1},
              {id: 16, nom: 'Blackwell ', prenom: 'Dorsey', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 10,
            dateStart: moment('20200616', 'YYYYMMDD'),
            reserveTimeStart: 'PM',
            dateEnd: moment('20200616', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Argentina',
              prenom: 'Mirel',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idUtilisateur: 1,
            idVehicule: 8,
            passagers: [
              {id: 15, nom: 'Silva ', prenom: 'Nettie', site: 1},
              {id: 16, nom: 'Blackwell ', prenom: 'Dorsey', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 11,
            dateStart: moment('20200618', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200618', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Argentina',
              prenom: 'Mirel',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 8,
            passagers: [
              {id: 15, nom: 'Silva ', prenom: 'Nettie', site: 1},
              {id: 16, nom: 'Blackwell ', prenom: 'Dorsey', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 12,
            dateStart: moment('20200620', 'YYYYMMDD'),
            reserveTimeStart: 'PM',
            dateEnd: moment('20200620', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Micky',
              prenom: 'Tino',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 8,
            passagers: [
              {id: 15, nom: 'Silva ', prenom: 'Nettie', site: 1},
              {id: 16, nom: 'Blackwell ', prenom: 'Dorsey', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
          {
            id: 13,
            dateStart: moment('20200622', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200622', 'YYYYMMDD'),
            reserveTimeEnd: 'PM',
            utilisateur: {
              id: 1,
              nom: 'Micky',
              prenom: 'Tino',
              site: {
                id: 1,
                libelle: 'Nantes'
              }
            },
            idVehicule: 8,
            passagers: [
              {id: 15, nom: 'Silva ', prenom: 'Nettie', site: 1},
              {id: 16, nom: 'Blackwell ', prenom: 'Dorsey', site: 1},
            ],
            destination: 'Lyon',
            description: 'RU client'
          },
        ]
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'authStatus']),
      year() {
        return this.dateContext.format('Y');
      },
      month() {
        return this.dateContext.format('MMMM');
      },
      daysInMonthReservations() {
        return this.cListReservations;
      },
      firstDayOfMonth() {
        let startDay = this.dateContext.startOf('month').weekday();
        if (startDay > 0) {
          startDay -= 1;
        }
        return startDay;
      },
      initialDate() {
        return this.today.get('date');
      },
      initialMonth() {
        return this.today.format('MMMM');
      },
      initialYear() {
        return this.today.format('Y');
      },
    },
    methods: {
      customLabel({nom, prenom}) {
        return `${nom} – ${prenom}`
      },
      addMonth() {
        this.dateContext = moment(this.dateContext).add(1, 'month');
        this.cListReservations = [];
        this.initListReservation();
        this.initPushDataReserve();
      },
      subtractMonth() {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
        this.cListReservations = [];
        this.initListReservation();
        this.initPushDataReserve()
      },
      checkSize(size) {
        let reserveSize = (size / this.maxVoitureSite) * 100;
        let classNameStatus;
        if (reserveSize <= 50) {
          classNameStatus = 'date-color-50';
        } else if (reserveSize > 50 && reserveSize <= 75) {
          classNameStatus = 'date-color-75';
        } else {
          classNameStatus = 'date-color-100';
        }
        return classNameStatus;
      },
      listReservationModal(thisDate, idArrayReserve, reserveTime) {
        this.reservations.filter((reserve) => {
          if (idArrayReserve.includes(reserve.id)) {
            this.cListReserveModal.push(reserve);
          }
        });
        let time = moment(thisDate).format('DD/MM/YYYY');
        this.cListTitleModal = 'Liste des réservations du ' + time + ' - ' + reserveTime;
        this.$bvModal.show('modal-list-reservation')
      },
      resetListReservation() {
        this.cListTitleModal = '';
        this.cListReserveModal = [];
      },
      editReserve(reserve) {
        this.cTitleReserveModal = 'Réservation de ' + reserve.utilisateur.nom + reserve.utilisateur.prenom;
        this.$bvModal.show("modal-reservation");
        this.form.date = moment(reserve.date).format('DD/MM/YYYY');
        this.form.reserveTime = reserve.reserveTime;
        this.form.idVehicule = reserve.idVehicule;
        this.form.passagers = reserve.passagers;
        this.form.destination = reserve.destination;
        this.form.description = reserve.description;
        console.log(JSON.stringify(reserve));
      },
      resetReserve() {
        this.cTitleReserveModal = '';
        this.form.date = '';
        this.form.reserveTime = '';
        this.form.idVehicule = '';
        this.form.passagers = [];
        this.form.destination = '';
        this.form.description = '';
      },
      initListReservation() {
        let dayArray = new Array(this.dateContext.daysInMonth());
        for (let i = 0; i < dayArray.length; i++) {
          let d = i + 1;
          this.cListReservations.push({
            date: this.dateContext.date(d).format('YYYYMMDD'),
            day: this.dateContext.date(d).get('date'),
            month: this.dateContext.date(d).format('MMMM'),
            year: this.dateContext.date(d).format('Y'),
            AM: 0,
            idReserveAM: [],
            PM: 0,
            idReservePM: [],
          })
        }
      },
      initPushDataReserve() {
        this.reservations.forEach((r) => {
          if (r.dateStart.format('YYYYMMDD') !== r.dateEnd.format('YYYYMMDD')) {
            this.cListReservations.find(function (e) {
              if (e.date === r.dateStart.format('YYYYMMDD')) {
                if (r.reserveTimeStart === 'AM') {
                  e.AM += 1;
                  e.PM += 1;
                  e.idReserveAM.push(r.id);
                  e.idReservePM.push(r.id);
                } else if (r.reserveTimeStart === 'PM') {
                  e.PM += 1;
                  e.idReservePM.push(r.id);
                }
              } else if (e.date === r.dateEnd.format('YYYYMMDD')) {
                if (r.reserveTimeEnd === 'AM') {
                  e.AM += 1;
                  e.idReserveAM.push(r.id);
                } else if (r.reserveTimeEnd === 'PM') {
                  e.AM += 1;
                  e.PM += 1;
                  e.idReserveAM.push(r.id);
                  e.idReservePM.push(r.id);
                }
              }
            });

            // Nombre de jours de différent entre la date de début et de fin
            let nbDaysDiff = r.dateEnd.diff(r.dateStart, 'days');

            for (let d = 1; d < nbDaysDiff; d++) {
              let m = moment(r.dateStart).add(d, 'day');
              this.cListReservations.find(function (e) {
                if (e.date === m.format('YYYYMMDD')) {
                  e.AM += 1;
                  e.PM += 1;
                  e.idReserveAM.push(r.id);
                  e.idReservePM.push(r.id);
                }
              });
            }

          } else if (r.dateStart.format('YYYYMMDD') === r.dateEnd.format('YYYYMMDD')) {
            this.cListReservations.find(function (e) {
              if (e.date === r.dateStart.format('YYYYMMDD')) {
                if (r.reserveTimeStart === r.reserveTimeEnd) {
                  if (r.reserveTimeStart === 'AM') {
                    e.AM += 1;
                    e.idReserveAM.push(r.id);
                  } else if (r.reserveTimeStart === 'PM') {
                    e.PM += 1;
                    e.idReservePM.push(r.id);
                  }
                } else {
                  e.AM += 1;
                  e.idReserveAM.push(r.id);
                  e.PM += 1;
                  e.idReservePM.push(r.id);
                }
              }
            });
          }
        });
      }
    },
    mounted() {
      this.initListReservation();
      this.initPushDataReserve();
    },
  };

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped lang="scss">
  .dashboard-page {
    .calendar {
      margin: 20px 0;

      .month {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;

        .month-title {
          text-transform: uppercase;
          font-weight: bold;
          margin: 0 10px;
        }
      }

      .weekdays {
        display: none;
      }

      .dates {
        .date {
          position: relative;
          width: 100%;
          min-height: 50px;
          border: 1px solid $colorDark;
          background-color: $colorGrey;
          margin-bottom: 10px;
          margin-right: 10px;
          box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.75);
          overflow-y: hidden;

          .container-date-number {
            position: absolute;
            top: 5px;
            left: 5px;
            font-weight: bold;
            width: 60px;
            height: 25px;
            border-radius: 10px;
            background-color: $colorBlue;
            color: $colorWhite;

            &.c-day {
              background-color: $colorGreen;
            }

            .date-number {
              position: absolute;
              width: 100%;
              text-align: center;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }

          .container-reservation {
            display: flex;
            flex-direction: column;
            margin-top: 30px;

            .date-reserve {
              margin: 5px;
              border-radius: 10px;
              color: $colorWhite;
              height: 40px;
              padding: 8px;
              text-align: center;
              transition: background-color 1s;
              outline: none;
              cursor: pointer;

              &.date-color-50 {
                background-color: $colorGreen;
              }

              &.date-color-75 {
                background-color: $colorOrange;
              }

              &.date-color-100 {
                background-color: $colorRed;
              }
            }
          }
        }

        .date-disable {
          opacity: 0.5;
        }
      }
    }
  }

  .modal {
    .list-reservation {
      .list-group {
        .list-group-item {
          display: flex;
          flex-direction: column;
          align-items: start;
          cursor: pointer;

          .titreReserve {
            display: flex;
            width: 100%;
            justify-content: space-between;

            .look {
              position: relative;
              background-color: $colorBlue;
              color: $colorWhite;
              width: 30px;
              height: 30px;
              border-radius: 50%;

              .icon-see {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }

          .targetReserve {
            span {
              margin-right: 20px;

              i {
                font-size: 1.5rem;
              }
            }
          }
        }
      }
    }

    .user-reservation {
      .option-list-user {
        display: flex;
        align-items: center;

        .nom-prenom {
          padding-left: 10px;
        }
      }
    }
  }

  @media screen and (min-width: 720px) {

    .dashboard-page {
      .calendar {

        .month {
          justify-content: left;
        }

        .weekdays {
          display: flex;
          flex-wrap: wrap;

          .day {
            width: calc((100% / 7) - 10px);
            margin: 10px 10px 10px 0;

            p {
              text-transform: uppercase;
              font-weight: bold;
              margin: 0;
            }
          }
        }

        .dates {
          display: flex;
          flex-wrap: wrap;

          .date {
            width: calc((100% / 7) - 10px);
            min-height: 150px;

            .container-date-number {
              width: 25px;
              height: 25px;
              border-radius: 50%;

              .date-number {
                .day {
                  display: none;
                }
              }
            }
          }
        }
      }
    }

  }
</style>
