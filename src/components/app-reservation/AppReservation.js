import moment from 'moment';
import Multiselect from 'vue-multiselect';
import { mapGetters } from 'vuex';
import {api} from '@/config';

export default {
  name: 'AppReservation',
  components: {
    Multiselect
  },
  data() {
    return {
      token: localStorage.getItem('user-token'),
      personnelsOptions: [],
      vehiculeOptions: [],
      vehiculeCle: [],
      vehiculeErreur: null,
      maxPersonnel: 0,
      disabledDateDebutCalendar: [],
      disabledDateFinCalendar: [],
      calendarDateFinStart: '',
      valueEnd: '',
      formReservation: {
        disabled: false,
        id: null,
        dateDebut: '',
        timeStart: '',
        dateFin: '',
        timeEnd: '',
        idVehicule: '',
        idCle: '',
        personnels: [],
        siteDestination: '',
        description: '',
        status: ''
      },
      currentReserve: '',
      cTitleReserveModal: 'Ajouter une réservation',
      initialDateStart: '',
      initialDateEnd: '',
      contact: '',
      action: '',
      hideReservation: {
        hideVehicule: '',
        hidePersonnels: '',
        hideSiteDestination: '',
        hideDescription: '',
        hideTimeStart: {
          am: false,
          pm: false
        },
        hideTimeEnd: {
          am: false,
          pm: false
        }
      },
      disabledReservation: {
        disabledTimeStart: '',
        disabledTimeEnd: '',
      },

    };
  },
  methods: {
    customLabel({nom, prenom}) {
      return `${nom} – ${prenom}`;
    },
    okModalReserve(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalReserve();
    },
    async submitModalReserve() {
      const listPersonnels = [];
      const thisPersonnels = this.formReservation.personnels;

      if(thisPersonnels)
      {
        thisPersonnels.forEach(p => {
          listPersonnels.push({
            id: p.id
          });
        });
      }

      const bodyFormReservation = {
        dateDebut: this.initialDateStart,
        dateFin: this.initialDateEnd,
        utilisateur: {
          id: this.userLogged.id
        },
        vehicule: {
          id: this.formReservation.idVehicule
        },
        personnels: listPersonnels,
        siteDestination: this.formReservation.siteDestination,
        description: this.formReservation.description,
        confirmationCle: false,
        isRejeted: false,
        isAccepted: false,
      };

      switch (this.action) {
        case 'add': {
          // POST
          await api.url('/api/Reservations')
            .headers({
              'Content-Type': 'application/json',
               Accept: 'application/json',
              Authorization: 'Bearer ' + this.token
            })
            .post(bodyFormReservation)
            .badRequest(err => {
              console.log(err);
              this.$parent.$parent.$refs.appToast.errorToast();
            })
            .res(r => {
              if(r.ok === true && this.$route.name === 'Dashboard') {
                this.$parent.reservations = [];
                this.$parent.cListReservations = [];
                this.$parent.initListReservation();
                this.$parent.getReservationsBySite();
                this.$parent.$parent.$refs.appToast.successToast();
              }
              else if (r.ok === true && this.$route.name === 'ReserveListUser')
              {
                this.$parent.getReservationsByUser();
                this.$parent.$parent.$refs.appToast.successToast();
              }
              this.$bvModal.hide('modal-reservation');
            });
          break;
        }
        case 'edit': {
          // PUT
          const idReservation = this.formReservation.id;

          await api.url(`/api/Reservations/${idReservation}`)
            .headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.token
            })
            .put(bodyFormReservation)
            .badRequest(err => {
              console.log(err);
              this.$parent.$parent.$refs.appToast.errorToast();
            })
            .res(r => {
              if(r.ok === true && this.$route.name === 'Dashboard') {
                this.$parent.reservations = [];
                this.$parent.cListReservations = [];
                this.$parent.initListReservation();
                this.$parent.getReservationsBySite();
                this.$parent.$parent.$refs.appToast.updateToast();
              }
              else if (r.ok === true && this.$route.name === 'ReserveListUser')
              {
                this.$parent.getReservationsByUser();
                this.$parent.$parent.$refs.appToast.updateToast();
              }
              this.$bvModal.hide('modal-reservation');
            });
          break;
        }
      }
    },
    resetModalReserve() {
      this.cTitleReserveModal = 'Ajouter une réservation';
      this.currentReserve = '';
      this.initialDateStart = '';
      this.initialDateEnd = '';
      this.valueEnd = '';
      this.calendarDateFinStart = '';
      this.contact = '';
      this.formReservation.id = null;
      this.formReservation.disabled = false;
      this.formReservation.dateDebut = '';
      this.formReservation.timeStart = '';
      this.formReservation.dateFin = '';
      this.formReservation.timeEnd = '';
      this.formReservation.idVehicule = '';
      this.vehiculeOptions = [];
      this.formReservation.idCle = '';
      this.vehiculeCle = [];
      this.formReservation.personnels = [];
      this.formReservation.siteDestination = '';
      this.formReservation.description = '';
      this.formReservation.status = '';
      this.action = '';
      this.hideReservation.hideVehicule = false;
      this.hideReservation.hidePersonnels = false;
      this.hideReservation.hideSiteDestination = false;
      this.hideReservation.hideDescription = false;
      this.hideReservation.hideTimeStart.am = false;
      this.hideReservation.hideTimeStart.pm = false;
      this.hideReservation.hideTimeEnd.am = false;
      this.hideReservation.hideTimeEnd.pm = false;
      this.disabledReservation.disabledTimeStart = true;
      this.disabledReservation.disabledTimeEnd = true;
    },
    addModalReserve() {
      this.action = 'add';
      this.disabledReservation.disabledTimeStart = true;
      this.disabledReservation.disabledTimeEnd = true;
      this.$bvModal.show('modal-reservation');
    },
    editModalReserve(reserve) {
      this.cTitleReserveModal = 'Réservation de ' + reserve.utilisateur.nom + ' ' + reserve.utilisateur.prenom;
      this.currentReserve = reserve;

      this.contact = reserve.utilisateur.mail;
      this.action = 'edit';
      this.hideReservation.hideVehicule = true;
      this.hideReservation.hidePersonnels = true;
      this.hideReservation.hideSiteDestination = true;
      this.hideReservation.hideDescription = true;
      this.hideReservation.hideTimeStart.am = true;
      this.hideReservation.hideTimeStart.pm = true;
      this.hideReservation.hideTimeEnd.am = true;
      this.hideReservation.hideTimeEnd.pm = true;

      if(this.currentReserve.utilisateur.id !== this.userLogged.id) {
        this.formReservation.disabled = true;
      }

      this.initializeData(reserve);

      if (reserve.status > 1) {
        this.formReservation.disabled = true;
        this.vehiculeOptions.push(reserve.vehicule);
        this.vehiculeCle = reserve.vehicule.cles;
      } else {
        this.selectDate();
      }
      this.$bvModal.show('modal-reservation');
    },
    seeModalReserve(reserve) {
      this.action = 'see';
      this.cTitleReserveModal = 'Réservation de ' + reserve.utilisateur.nom + ' ' + reserve.utilisateur.prenom;
      this.hideReservation.hideVehicule = true;
      this.hideReservation.hidePersonnels = true;
      this.hideReservation.hideSiteDestination = true;
      this.hideReservation.hideDescription = true;
      this.formReservation.disabled = true;
      this.hideReservation.hideTimeStart.am = true;
      this.hideReservation.hideTimeStart.pm = true;
      this.hideReservation.hideTimeEnd.am = true;
      this.hideReservation.hideTimeEnd.pm = true;

      this.$bvModal.show('modal-reservation');
      this.vehiculeOptions.push(reserve.vehicule);
      this.vehiculeCle = reserve.vehicule.cles;
      this.initializeData(reserve);
    },
    onContextDateStart(ctxS) {
      const dateMonthYear = moment(ctxS.activeDate).format('M-YYYY');
      this.getFullReservedDays(dateMonthYear);

      if (ctxS.selectedDate != null) {
        const dateSelected = moment(ctxS.activeYMD);
        this.formReservation.dateDebut = ctxS.activeFormatted;
        this.initialDateStart = ctxS.activeYMD;
        this.hideReservation.hideTimeStart.am = true;
        this.hideReservation.hideTimeStart.pm = true;
        this.disabledReservation.disabledTimeStart = false;

        this.valueEnd = '';
        this.formReservation.dateFin = '';
        this.initialDateEnd = '';
        this.hideReservation.hideTimeEnd.am = true;
        this.hideReservation.hideTimeEnd.pm = true;
        this.disabledReservation.disabledTimeEnd = true;
        this.calendarDateFinStart = new Date(dateSelected.format('YYYY-MM-DD'));

        // Filtrer si on peut réserver le matin ou l'après midi
        this.disabledDateDebutCalendar.forEach(d => {
          if(moment(d.date).format('YYYY-MM-DD') === dateSelected.format('YYYY-MM-DD')) {
            if(d.am === true) {
              this.hideReservation.hideTimeStart.am = false;
            } else if (d.pm === true) {
              this.hideReservation.hideTimeStart.pm = false;
            }
          }
        });

        this.selectDate();
      }
    },
    disabledDateDebut(ymd, date) {
      const thisDate = moment(date);
      let days = 0;

      // Désactiver les dates qui sont indisponibles
      this.disabledDateDebutCalendar.forEach(d => {
        if(d.am === true
          && d.pm === true
          && moment(d.date).format('YYYY-MM-DD') === thisDate.format('YYYY-MM-DD')) {
          days = thisDate.format('DD');
        }
      });

      return days;
    },
    onContextDateEnd(ctxE) {
      const dateMonthYear = moment(ctxE.activeDate).format('M-YYYY');
      this.getFullReservedDays(dateMonthYear);

      if (ctxE.selectedDate != null) {
        const dateSelected = moment(ctxE.activeYMD);
        this.formReservation.dateFin = ctxE.activeFormatted;
        this.initialDateEnd = ctxE.activeYMD;
        this.hideReservation.hideTimeEnd.am = true;
        this.hideReservation.hideTimeEnd.pm = true;
        this.disabledReservation.disabledTimeEnd = false;
        this.valueEnd = new Date(dateSelected.format('YYYY-MM-DD'));

        // Filtrer si on peut réserver le matin ou l'après midi
        this.disabledDateFinCalendar.forEach(d => {
          if(moment(d.date).format('YYYY-MM-DD') === dateSelected.format('YYYY-MM-DD')) {
            if(d.am === true) {
              this.hideReservation.hideTimeEnd.am = false;
            } else if (d.pm === true) {
              this.hideReservation.hideTimeEnd.pm = false;
            }
          }
        });

        this.selectDate();
      }
    },
    disabledDateFin(ymd, date) {
      const thisDate = moment(date);
      let days = 0;
      // Désactiver les dates qui sont indisponibles
      this.disabledDateFinCalendar.forEach(d => {
        if(d.am === true
          && d.pm === true
          && moment(d.date).format('YYYY-MM-DD') === thisDate.format('YYYY-MM-DD')) {
          days = thisDate.format('DD');
        }
      });

      return days;
    },
    selectDate() {
      const dD = moment(this.initialDateStart);
      const dF = moment(this.initialDateEnd);
      const tS = this.formReservation.timeStart;
      const tE = this.formReservation.timeEnd;

      // Si c'est la même date et que la timeStart est l'après-midi alors on désactive l'option matin
      if(dD.isSame(dF) && tS === 'PM')
      {
        this.hideReservation.hideTimeEnd.am = false;
      }

      const dateInfo = {
        dateD: null,
        dateF: null,
      };

      // Si les 4 champs sont compléter alors on récupère la liste des véhicules disponible sur cette période
      if(dD.isValid() && dF.isValid() && tS !== '' && tE !== '')
      {
        dateInfo.dateD = tS === 'AM' ? dD.format('YYYY-MM-DDT09:00:00') : dD.format('YYYY-MM-DDT15:00:00');
        dateInfo.dateF = tE === 'AM' ? dF.format('YYYY-MM-DDT09:00:00') : dF.format('YYYY-MM-DDT15:00:00');

        this.getVehiculeNonResaBySiteAndDate(dateInfo.dateD, dateInfo.dateF);
        this.hideReservation.hideVehicule = true;
      }
    },
    selectVoiture(idVehicule) {
      this.vehiculeOptions.forEach(v => {
        if(v.id === idVehicule)
        {
          this.vehiculeCle = v.cles;
          this.maxPersonnel = v.nbPlaces - 1;
          this.formReservation.personnels = [];
          this.hideReservation.hidePersonnels = true;
          this.hideReservation.hideSiteDestination = true;
          this.hideReservation.hideDescription = true;
        }
      });
    },
    initializeData(reserve) {
      this.formReservation.id = reserve.id;
      this.initialDateStart = reserve.dateDebut;
      this.initialDateEnd = reserve.dateFin;
      this.formReservation.dateDebut = moment(reserve.dateDebut).format('DD/MM/YYYY');
      this.formReservation.timeStart = reserve.timeStart;
      this.formReservation.dateFin = moment(reserve.dateFin).format('DD/MM/YYYY');
      this.formReservation.timeEnd = reserve.timeEnd;
      this.formReservation.idVehicule = reserve.vehicule.id;
      this.formReservation.idCle = reserve.cle !== null ? reserve.cle.id : null;
      this.formReservation.personnels = reserve.personnels;
      this.formReservation.siteDestination = reserve.siteDestination;
      this.formReservation.description = reserve.description;
      this.formReservation.status = reserve.status;
    },
    async getVehiculeNonResaBySiteAndDate(dateDebut,dateFin) {
      const userSiteId = this.userLogged.site.id;
      this.initialDateStart = dateDebut;
      this.initialDateEnd = dateFin;

      await api.url(`/api/Vehicules/GetVehiculesNonResaBySiteAndDate/${userSiteId}/${dateDebut}/${dateFin}`)
        .headers({Authorization: 'Bearer ' + this.token})
        .get()
        .json()
        .then(data => {
          if(data.length === 0) {
            if(this.action === 'edit') {
              this.vehiculeOptions.push(this.currentReserve.vehicule);
              this.vehiculeCle = this.currentReserve.vehicule.cles;
              this.maxPersonnel = this.currentReserve.vehicule.nbPlaces - 1;
              this.getPersonnelsNonResaBySiteAndDate(dateDebut,dateFin);
            } else {
              this.vehiculeOptions = [];
              this.vehiculeErreur = false;
            }
          } else {

            this.vehiculeOptions = data;
            this.vehiculeErreur = null;
            this.getPersonnelsNonResaBySiteAndDate(dateDebut,dateFin);

            if(this.action === 'edit') {
              this.vehiculeOptions.push(this.currentReserve.vehicule);
              this.vehiculeCle = this.currentReserve.vehicule.cles;
              this.maxPersonnel = this.currentReserve.vehicule.nbPlaces - 1;
            }
          }
        });
    },
    async getPersonnelsNonResaBySiteAndDate(dateDebut,dateFin) {
      let userSiteId = null;
      if(this.action === 'add') {
        userSiteId = this.userLogged.site.id;
      } else if (this.action === 'edit') {
        userSiteId = this.currentReserve.utilisateur.site.id;
      }
      await api.url(`/api/Personnel/GetPersonnelsNonResaBySiteAndDate/${userSiteId}/${dateDebut}/${dateFin}`)
        .headers({Authorization: 'Bearer ' + this.token})
        .get()
        .json()
        .then(data => {
          this.personnelsOptions = [];
          data.forEach(d => {
            if(d.id !== this.userLogged.id) {
              this.personnelsOptions.push(d);
            }
          });
          if(this.action === 'edit') {
            this.currentReserve.personnels.forEach(d => {
              this.personnelsOptions.push(d);
            });
          }
        });
    },
    async getFullReservedDays(date) {
      const userSiteId = this.userLogged.site.id;

      await api.url(`/api/Reservations/GetFullReservedDays/${userSiteId}/${date}`)
        .headers({Authorization: 'Bearer ' + this.token})
        .get()
        .json()
        .then(data => {
          this.disabledDateDebutCalendar = data;
          this.disabledDateFinCalendar = data;
        });
    },
  },
  computed: {
    ...mapGetters(['isAdmin', 'userLogged']),
  },
  mounted() {

  }
};
