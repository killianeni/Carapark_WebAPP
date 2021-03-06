<template>
  <div class="dashboard-page container-custom">
    <div class="container-fluid">
      <div class="calendar">
        <div class="calendar-action">
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
          <div class="action">
            <b-button variant="primary" @click="addReserveModal">
              <i class="kmap-icons icon-add mr-2" />
              Ajouter une réservation
            </b-button>
          </div>
        </div>
        <div class="weekdays">
          <div class="day" v-for="(day, indexDay) in days" :key="indexDay">
            <p>{{ day }}</p>
          </div>
        </div>
        <div class="dates">
          <div
            class="date"
            v-for="(blank,indexBlank) in firstDayOfMonth"
            :key="indexBlank + '_key'"
            :class="{ 'date-disable' : blank }"
          />
          <div class="date" v-for="(dateR) in daysInMonthReservations" :key="dateR.day">
            <span
              class="container-date-number"
              :class="{ 'c-day' : dateR.day === initialDate && month === initialMonth && year === initialYear }"
            >
              <span class="date-number">
                {{ dateR.day }}  <span class="day"> - {{ dateContext.date(dateR.day).format('dd') }}</span>
              </span>
            </span>
            <div class="container-reservation">
              <span
                class="date-reserve date-am"
                @click="listReservationModal(dateR.date,dateR.idReserveAM,'AM')"
                v-if="dateR.AM"
                :class="checkSize(dateR.AM)"
              >
                AM - {{ dateR.AM }}/{{ maxVoitureSite }}
              </span>
              <span
                class="date-reserve date-pm"
                @click="listReservationModal(dateR.date,dateR.idReservePM,'PM')"
                v-if="dateR.PM"
                :class="checkSize(dateR.PM)"
              >
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
            v-for="reserve in cListReserveModal"
            :key="reserve.id"
            @click="editReserveModal(reserve)"
          >
            <div class="titreReserve">
              <h5 class="mb-1">
                {{ reserve.utilisateur.nom }} {{ reserve.utilisateur.prenom }}
              </h5>
              <span class="look">
                <i class="kmap-icons icon-see" />
              </span>
            </div>
            <div class="targetReserve">
              <div class="distance">
                <span><i class="kmap-icons icon-startFlag" />{{ reserve.utilisateur.site.libelle }}</span>
                <span><i class="kmap-icons icon-next" /></span>
                <span><i class="kmap-icons icon-endFlag" />{{ reserve.siteDestination }}</span>
              </div>
              <div class="status">
                <b-badge v-if="reserve.status === 1" variant="warning">
                  En attente
                </b-badge>
                <b-badge v-if="reserve.status === 2" variant="success">
                  Validé
                </b-badge>
                <b-badge v-if="reserve.status === 3" variant="danger">
                  Rejeté
                </b-badge>
                <b-badge v-if="reserve.status === 4" variant="dark">
                  Clôturé
                </b-badge>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-modal>
    <AppReservation ref="formReservation" />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import AppReservation from '@/components/app-reservation/AppReservation.vue';
  import moment from 'moment';
  import {api} from '@/config';

  require('../store/modules/moment-locale-fr');

  export default {
    name: 'Dashboard',
    components: {
      AppReservation
    },
    data() {
      return {
        today: moment(),
        dateContext: moment(),
        days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        maxVoitureSite: 0,
        cListTitleModal: '',
        cListReserveModal: [],
        cListReservations: [],
        reservations: [],
      };
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'authStatus', 'userLogged']),
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
        this.initPushDataReserve();
      },
      checkSize(size) {
        const reserveSize = (size / this.maxVoitureSite) * 100;
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
        this.reservations.filter(reserve => {
          if (idArrayReserve.includes(reserve.id)) {
            this.cListReserveModal.push(reserve);
          }
        });
        const time = moment(thisDate).format('DD/MM/YYYY');
        this.cListTitleModal = 'Liste des réservations du ' + time + ' - ' + reserveTime;
        this.$bvModal.show('modal-list-reservation');
      },
      resetListReservation() {
        this.cListTitleModal = '';
        this.cListReserveModal = [];
      },
      async getReservationsBySite() {
        const token = localStorage.getItem('user-token');
        if(this.userLogged.site != null)
        {
          const userIdSite = this.userLogged.site.id;
          await api.url(`/api/Reservations/GetReservationsBySite/${userIdSite}`)
            .headers({Authorization: 'Bearer ' + token})
            .get()
            .json()
            .then(data => {
              data.forEach(d => {
                // On retire les status "Rejeté" et "Clôturé"
                if(d.status !== 3)
                {
                  this.reservations.push(d);
                }
              });
              this.initPushDataReserve();
            });
        }
      },
      async getCountVehiculesActifBySite() {
        const userIdSite = this.userLogged.site.id;
        const token = localStorage.getItem('user-token');

        this.maxVoitureSite = await api.url(`/api/Vehicules/CountVehiculesActifBySite/${userIdSite}`)
          .headers({Authorization: 'Bearer ' + token})
          .get()
          .json();
      },
      initListReservation() {
        const dayArray = new Array(this.dateContext.daysInMonth());
        for (let i = 0; i < dayArray.length; i++) {
          const d = i + 1;
          this.cListReservations.push({
            date: this.dateContext.date(d).format('YYYYMMDD'),
            day: this.dateContext.date(d).get('date'),
            month: this.dateContext.date(d).format('MMMM'),
            year: this.dateContext.date(d).format('Y'),
            AM: 0,
            idReserveAM: [],
            PM: 0,
            idReservePM: [],
          });
        }
      },
      initPushDataReserve() {
        this.reservations.forEach(r => {
          if (moment(r.dateDebut).format('YYYYMMDD') !== moment(r.dateFin).format('YYYYMMDD') && r.status !== 3) {
            this.cListReservations.find(function (e) {
              if (e.date === moment(r.dateDebut).format('YYYYMMDD')) {
                if (r.timeStart === 'AM') {
                  e.AM += 1;
                  e.PM += 1;
                  e.idReserveAM.push(r.id);
                  e.idReservePM.push(r.id);
                } else if (r.timeStart === 'PM') {
                  e.PM += 1;
                  e.idReservePM.push(r.id);
                }
              } else if (e.date === moment(r.dateFin).format('YYYYMMDD')) {
                if (r.timeEnd === 'AM') {
                  e.AM += 1;
                  e.idReserveAM.push(r.id);
                } else if (r.timeEnd === 'PM') {
                  e.AM += 1;
                  e.PM += 1;
                  e.idReserveAM.push(r.id);
                  e.idReservePM.push(r.id);
                }
              }
            });
            // Nombre de jours de différent entre la date de début et de fin
            const nbDaysDiff = moment(r.dateFin).diff(moment(r.dateDebut), 'days');

            for (let d = 1; d < nbDaysDiff; d++) {
              const m = moment(r.dateDebut).add(d, 'day');
              this.cListReservations.find(function (e) {
                if (e.date === m.format('YYYYMMDD')) {
                  e.AM += 1;
                  e.PM += 1;
                  e.idReserveAM.push(r.id);
                  e.idReservePM.push(r.id);
                }
              });
            }
          } else if (moment(r.dateDebut).format('YYYYMMDD') === moment(r.dateFin).format('YYYYMMDD') && r.status !== 3) {
            this.cListReservations.find(function (e) {
              if (e.date === moment(r.dateDebut).format('YYYYMMDD')) {
                if (r.timeStart === r.timeEnd) {
                  if (r.timeStart === 'AM') {
                    e.AM += 1;
                    e.idReserveAM.push(r.id);
                  } else if (r.timeStart === 'PM') {
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
      },
      addReserveModal() {
        this.$refs.formReservation.addModalReserve();
      },
    },
    mounted() {
      this.getCountVehiculesActifBySite();
      this.getReservationsBySite();
      this.initListReservation();
    },
  };

</script>

<style scoped lang="scss">
  .dashboard-page {
    .calendar {
      .calendar-action {
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

        .action {
          text-align: center;
          margin: 20px 0;
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

  #modal-list-reservation {
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
              display: block;
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
  }

  @media screen and (min-width: 720px) {

    .dashboard-page {
      .calendar {
        .calendar-action {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .month {
            justify-content: left;
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
