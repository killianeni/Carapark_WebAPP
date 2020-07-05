<template>
  <div>
    <div v-if="isAuthenticated">
      <div class="dashboard-page container-custom">
        <div class="container-fluid">
          <div class="calendar">
            <div class="month">
              <b-button variant="primary" class="rounded-circle" @click="subtractMonth">
                <i class="kmap-icons icon-back"/>
              </b-button>
              <h3 class="month-title">
                {{ month + ' - ' + year }}
              </h3>
              <b-button variant="primary" class="rounded-circle" @click="addMonth">
                <i class="kmap-icons icon-next"/>
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
                <span class="container-date-number"
                      :class="{ 'c-day' : dateR.day === initialDate && month === initialMonth && year === initialYear }">
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
                @click="editReserveModal(reserve)"
              >
                <div class="titreReserve">
                  <h5 class="mb-1">
                    {{ reserve.id }} {{ reserve.utilisateur.nom }} {{ reserve.utilisateur.prenom }}
                  </h5>
                  <span class="look">
                    <i class="kmap-icons icon-see" />
                  </span>
                </div>
                <div class="targetReserve">
                  <div class="distance">
                    <span><i class="kmap-icons icon-startFlag"></i>{{ reserve.utilisateur.site.libelle }}</span>
                    <span><i class="kmap-icons icon-next"></i></span>
                    <span><i class="kmap-icons icon-endFlag"></i>{{ reserve.destination }}</span>
                  </div>
                  <div class="status">
                    <b-badge v-if="reserve.status === 1" variant="warning">En attente</b-badge>
                    <b-badge v-if="reserve.status === 2" variant="success">Validé</b-badge>
                    <b-badge v-if="reserve.status === 3" variant="danger">Rejeté</b-badge>
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group>
          </div>
        </b-modal>
        <AppReservation ref="formReservation"></AppReservation>
      </div>
    </div>
    <div v-if="!isAuthenticated">
      <login/>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import AppReservation from '@/components/app-reservation/AppReservation.vue';
  import Login from './Login';
  import moment from 'moment';

  require('../store/modules/moment-locale-fr');

  export default {
    name: 'Dashboard',
    components: {
      Login,
      AppReservation
    },
    data() {
      return {
        today: moment(),
        dateContext: moment(),
        days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        maxVoitureSite: 8,
        cListTitleModal: '',
        cListReserveModal: [],
        cListReservations: [],
        reservations: [
          {
            id: 1,
            dateStart: moment('20200701', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200705', 'YYYYMMDD'),
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
            dateStart: moment('20200702', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200703', 'YYYYMMDD'),
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
            description: 'RU client',
            status: 2
          },
          {
            id: 3,
            dateStart: moment('20200703', 'YYYYMMDD'),
            reserveTimeStart: 'AM',
            dateEnd: moment('20200705', 'YYYYMMDD'),
            reserveTimeEnd: 'AM',
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
              {id: 3, nom: 'Fddm ', prenom: 'Arnes', site: 1},
              {id: 4, nom: 'Rorsey ', prenom: 'Lackwell', site: 1},
            ],
            destination: 'Paris',
            description: 'RU client',
            status: 3
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
      },
      editReserveModal(reserve) {
        this.$refs.formReservation.editModalReserve(reserve);
      }
    },
    mounted() {
      this.initListReservation();
      this.initPushDataReserve();
    },
  };

</script>

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
            display: flex;
            justify-content: space-between;
            width: 100%;
            .distance {
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
