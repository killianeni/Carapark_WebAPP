<template>
  <div>
    <div v-if="isAuthenticated">
      <div class="dashboard-page container-custom">
        <div class="container-fluid">
          <div class="calendar">
            <div class="month">
              <b-button variant="primary" class="rounded-circle" @click="subtractMonth">
                <i class="kmap-icons icon-back"></i>
              </b-button>
              <h3 class="month-title">{{month + ' - ' + year}}</h3>
              <b-button variant="primary" class="rounded-circle" @click="addMonth">
                <i class="kmap-icons icon-next"></i>
              </b-button>
            </div>
            <div class="weekdays">
              <div class="day" v-for="(day, indexDay) in days" v-bind:key="indexDay">
                <p>{{day}}</p>
              </div>
            </div>
            <div class="dates">
              <div class="date"
                   v-for="(blank,indexBlank) in firstDayOfMonth" v-bind:key="indexBlank + '_key'"
                   :class="{ 'date-disable' : blank}"
              >
              </div>
              <div class="date" v-for="(date) in daysInMonth" v-bind:key="date">
                <span class="date-number"
                      :class="{ 'current-day' : date === initialDate && month === initialMonth && year === initialYear }">
                  {{date}}
                </span>
                <div class="container-reservation">
                  <span class="date-reserve date-am"
                        @click="listReservation(dateContext.date(date).format('YYYYMMDD'),'AM')"
                        v-if="reservationAm(date).length"
                        :class="checkSize(reservationAm(date).length)">
                    Réservations AM - {{ reservationAm(date).length }}/{{ maxVoitureSite }}
                  </span>
                  <span class="date-reserve date-pm"
                        :data-element-date="dateContext.date(date).format('DD/MM/YYYY')"
                        data-reserve-time="PM"
                        v-if="reservationPm(date).length"
                        :class="checkSize(reservationPm(date).length)">
                    Réservations PM - {{ reservationPm(date).length }}/{{ maxVoitureSite }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <b-modal
          id="modal-list-reservation"
          ref="modal"
          title="Liste des réservations"
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
              <b-list-group-item v-for="reserve in currentListReserve" v-bind:key="reserve.id" v-b-modal.modal-reservation>
                {{reserve.nom}}
                {{reserve.prenom}}
              </b-list-group-item>
            </b-list-group>
          </div>
        </b-modal>

        <b-modal
          id="modal-reservation"
          title="Réservation"
          ok-only
        >
          <p class="my-2">First Modal</p>
          <b-button v-b-modal.modal-multi-2>Open Second Modal</b-button>
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

  require('../store/modules/moment-locale-fr');

  export default {
    name: 'Dashboard',
    components: {
      Login
    },
    data() {
      return {
        today: moment(),
        dateContext: moment(),
        days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        maxVoitureSite: 8,
        currentListReserve: [],
        reservations: [
          {
            id: 1,
            date: moment("20200603", "YYYYMMDD"),
            dateEnd: moment("20200603", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Michel",
            prenom: "Toto",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 2,
            date: moment("20200603", "YYYYMMDD"),
            dateEnd: moment("20200603", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Thomas",
            prenom: "Tata",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 3,
            date: moment("20200603", "YYYYMMDD"),
            dateEnd: moment("20200603", "YYYYMMDD"),
            reserveTime: 'PM',
            nom: "Dany",
            prenom: "Bane",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 4,
            date: moment("20200603", "YYYYMMDD"),
            dateEnd: moment("20200603", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Micky",
            prenom: "Tino",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 4,
            date: moment("20200603", "YYYYMMDD"),
            dateEnd: moment("20200603", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Micky",
            prenom: "Tino",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 5,
            date: moment("20200610", "YYYYMMDD"),
            dateEnd: moment("20200610", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Argentina",
            prenom: "Mirel",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 6,
            date: moment("20200610", "YYYYMMDD"),
            dateEnd: moment("20200610", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Argentina",
            prenom: "Mirel",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 7,
            date: moment("20200610", "YYYYMMDD"),
            dateEnd: moment("20200610", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Argentina",
            prenom: "Mirel",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 8,
            date: moment("20200610", "YYYYMMDD"),
            dateEnd: moment("20200610", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Argentina",
            prenom: "Mirel",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 9,
            date: moment("20200610", "YYYYMMDD"),
            dateEnd: moment("20200610", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Argentina",
            prenom: "Mirel",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 10,
            date: moment("20200610", "YYYYMMDD"),
            dateEnd: moment("20200610", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Argentina",
            prenom: "Mirel",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 11,
            date: moment("20200610", "YYYYMMDD"),
            dateEnd: moment("20200610", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Argentina",
            prenom: "Mirel",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 12,
            date: moment("20200603", "YYYYMMDD"),
            dateEnd: moment("20200603", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Micky",
            prenom: "Tino",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
          },
          {
            id: 13,
            date: moment("20200603", "YYYYMMDD"),
            dateEnd: moment("20200603", "YYYYMMDD"),
            reserveTime: 'AM',
            nom: "Micky",
            prenom: "Tino",
            idUtilisateur: 1,
            vehicule: Object,
            list_personne: Object,
            site_destination: Object,
            description: String
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
      daysInMonth() {
        return this.dateContext.daysInMonth();
      },
      currentDate() {
        return this.dateContext.get('date');
      },
      firstDayOfMonth() {
        let startOfMonth = this.dateContext.startOf('month');
        return startOfMonth.weekday();
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
      },
      subtractMonth() {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
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
      reservationAm(currentDate) {
        return this.reservations.filter((reserve) => {
          let nbReservation = 0;
          if (reserve.date.get('date') === currentDate
            && reserve.date.format('MMMM') === this.month
            && reserve.reserveTime === 'AM') {
            nbReservation++;
          }
          return nbReservation;
        })
      },
      reservationPm(currentDate) {
        return this.reservations.filter((reserve) => {
          let nbReservation = 0;
          if (reserve.date.get('date') === currentDate
            && reserve.date.format('MMMM') === this.month
            && reserve.reserveTime === 'PM') {
            nbReservation++;
          }
          return nbReservation;
        })
      },
      listReservation(thisDate, thisReserveTime) {

        this.reservations.filter((reserve) => {
          if (reserve.date.format('YYYYMMDD') === thisDate
            && reserve.reserveTime === thisReserveTime) {
            this.currentListReserve.push(reserve);
          }
        });
        this.$bvModal.show('modal-list-reservation')
      },
      resetListReservation() {
        this.currentListReserve = [];
      }
    }
  };
</script>

<style scoped lang="scss">
  .dashboard-page {
    .calendar {
      margin: 20px 0;

      .month {
        display: flex;
        align-items: center;

        .month-title {
          text-transform: uppercase;
          font-weight: bold;
          margin: 0 10px;
        }
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
          position: relative;
          width: calc((100% / 7) - 10px);
          height: 150px;
          border: 1px solid $colorDark;
          background-color: $colorGrey;
          margin-bottom: 10px;
          margin-right: 10px;
          box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.75);
          overflow-y: hidden;

          .date-number {
            position: absolute;
            top: 5px;
            left: 5px;
            font-weight: bold;

            &.current-day {
              color: $colorOrange;
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
          color: $colorWhite;
          background-color: rgba(54, 70, 82, 0.8);
        }
      }
    }
  }
</style>
