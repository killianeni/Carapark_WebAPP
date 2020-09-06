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
      formReservation: {
        disabled: false,
        dateDebut: '',
        timeStart: '',
        dateFin: '',
        timeEnd: '',
        idVehicule: '',
        idCle: '',
        personnels: [],
        siteDestination: '',
        description: '',
        commentaire: '',
        status: ''
      },
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
        hideCommentaire: '',
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
        disabledCommentaire: '',
        disabledTimeStart: '',
        disabledTimeEnd: '',
      },

    }
  },
  methods: {
    customLabel({nom, prenom}) {
      return `${nom} – ${prenom}`
    },
    okModalReserve(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalReserve();
    },
    async submitModalReserve() {
      switch (this.action) {
        case 'add': {
          // POST
          const bodyFormReservation = {
            'dateDebut': this.initialDateStart,
            'dateFin': this.initialDateEnd,
            'utilisateur': {
              id: this.userLogged.id
            },
            'vehicule': {
              id: this.formReservation.idVehicule
            },
            'personnels': [],
            'siteDestination': this.formReservation.siteDestination,
            'description': this.formReservation.description,
            'confirmationCle': false,
            'isRejeted': false,
            'isAccepted': false,
            'commentaire': '',
          };

          await api.url('/api/Reservations')
            .headers({
              'Content-Type': 'application/json',
               Accept: 'application/json',
              'Authorization': 'Bearer ' + this.token
            })
            .post(bodyFormReservation)
            .badRequest(err => console.log(err))
            .res(r => {
              if(r.ok === true) {
                this.$parent.reservations = [];
                this.$parent.cListReservations = [];
                this.$parent.initListReservation();
                this.$parent.getReservationsBySite();
                this.$bvModal.hide('modal-reservation');
              }
            });
          break;
        }
        case 'edit': {
          // PUT
          console.log(this.action);
          console.log(this.formReservation);
          break;
        }
        case 'editCommentaire': {
          // PUT
          console.log(this.action);
          console.log(this.formReservation);
          break;
        }
      }
    },
    resetModalReserve() {
      this.cTitleReserveModal = 'Ajouter une réservation';
      this.initialDateStart = '';
      this.initialDateEnd = '';
      this.contact = '';
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
      this.hideReservation.hideCommentaire = false;
      this.hideReservation.hideTimeStart.am = false;
      this.hideReservation.hideTimeStart.pm = false;
      this.hideReservation.hideTimeEnd.am = false;
      this.hideReservation.hideTimeEnd.pm = false;
      this.disabledReservation.disabledTimeStart = true;
      this.disabledReservation.disabledTimeEnd = true;
    },
    addModalReserve() {
      this.action = 'add';
      this.checkVisibleCommentaire();
      this.disabledReservation.disabledTimeStart = true;
      this.disabledReservation.disabledTimeEnd = true;
      this.$bvModal.show('modal-reservation');
    },
    editModalReserve(reserve) {
      this.cTitleReserveModal = 'Réservation de ' + reserve.utilisateur.nom + reserve.utilisateur.prenom;
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
      this.checkVisibleCommentaire(reserve);

      this.$bvModal.show('modal-reservation');

      if (reserve.status > 1) {
        this.formReservation.disabled = true;
        this.vehiculeOptions = [reserve.vehicule];
        this.vehiculeCle = reserve.vehicule.cles;
      } else {
        this.getVehiculesBySite(reserve);
        this.vehiculeCle = reserve.vehicule.cles;
      }
      this.initializeData(reserve);
    },
    editCommentaireModalReserve(reserve) {
      this.action = 'editCommentaire';
      this.hideReservation.hideVehicule = true;
      this.hideReservation.hidePersonnels = true;
      this.hideReservation.hideSiteDestination = true;
      this.hideReservation.hideDescription = true;
      this.formReservation.disabled = true;
      this.hideReservation.hideTimeStart.am = true;
      this.hideReservation.hideTimeStart.pm = true;
      this.hideReservation.hideTimeEnd.am = true;
      this.hideReservation.hideTimeEnd.pm = true;
      this.checkVisibleCommentaire(reserve);

      this.$bvModal.show('modal-reservation');
      console.log(reserve);
      this.getVehiculesBySite(reserve);
      this.vehiculeCle = reserve.vehicule.cles;
      this.initializeData(reserve);
    },
    onContextDateStart(ctxS) {
      const dateMonthYear = moment(ctxS.activeDate).format('M-YYYY');
      this.getFullReservedDays(dateMonthYear, this.disabledDateDebutCalendar);

      if (ctxS.selectedDate != null) {
        const dateSelected = moment(ctxS.activeYMD);
        this.formReservation.dateDebut = ctxS.activeFormatted;
        this.initialDateStart = ctxS.activeYMD;
        this.calendarDateFinStart = new Date(dateSelected.format('YYYY-MM-DD'));
        this.hideReservation.hideTimeStart.am = true;
        this.hideReservation.hideTimeStart.pm = true;
        this.disabledReservation.disabledTimeStart = false;
        this.disabledDateDebutCalendar.forEach((d) => {
          if(moment(d.date).format('YYYY-MM-DD') === dateSelected.format('YYYY-MM-DD')) {
            if(d.AM === true) {
              this.hideReservation.hideTimeStart.am = false;
            } else if (d.PM === true) {
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

      this.disabledDateDebutCalendar.forEach((d) => {
        if(d.AM === true && d.PM === true && d.date === thisDate.format('YYYY-MM-DD')) {
          days = thisDate.format('DD');
        }
      });

      return days;
    },
    shownDateDebut() {
      console.log('open debut');
    },
    onContextDateEnd(ctxE) {
      const dateMonthYear = moment(ctxE.activeDate).format('M-YYYY');
      this.getFullReservedDays(dateMonthYear, this.disabledDateFinCalendar);

      if (ctxE.selectedDate != null) {
        const dateSelected = moment(ctxE.activeYMD);
        this.formReservation.dateFin = ctxE.activeFormatted;
        this.initialDateEnd = ctxE.activeYMD;
        this.hideReservation.hideTimeEnd.am = true;
        this.hideReservation.hideTimeEnd.pm = true;
        this.disabledReservation.disabledTimeEnd = false;

        this.disabledDateFinCalendar.forEach((d) => {
          if(d.date === dateSelected.format('YYYY-MM-DD')) {
            if(d.AM === true) {
              this.hideReservation.hideTimeEnd.am = false;
            } else if (d.PM === true) {
              this.hideReservation.hideTimeEnd.pm = false;
            }
          }
        });

        this.selectDate();
      }
    },
    shownDateEnd() {
      console.log('open end');
    },
    disabledDateFin(ymd, date) {
      const thisDate = moment(date);
      let days = 0;

      this.disabledDateFinCalendar.forEach((d) => {
        if(d.AM === true && d.PM === true && d.date === thisDate.format('YYYY-MM-DD')) {
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
      const dateInfo = {
        dateD: null,
        dateF: null,
      };

      if(dD.isValid() && dF.isValid() && tS !== '' && tE !== '')
      {
        dateInfo.dateD = tS === 'AM' ? dD.format('YYYY-MM-DDT09:00:00') : dD.format('YYYY-MM-DDT15:00:00');
        dateInfo.dateF = tE === 'AM' ? dF.format('YYYY-MM-DDT09:00:00') : dF.format('YYYY-MM-DDT15:00:00');

        this.getVehiculeNonResaBySiteAndDate(dateInfo.dateD, dateInfo.dateF);
        this.hideReservation.hideVehicule = true;
      }
    },
    selectVoiture(idVehicule) {
      this.vehiculeOptions.forEach((v) => {
        if(v.id === idVehicule)
        {
          this.vehiculeCle = v.cles;
          this.maxPersonnel = v.nbPlaces;
          this.formReservation.personnels = [];
          this.hideReservation.hidePersonnels = true;
          this.hideReservation.hideSiteDestination = true;
          this.hideReservation.hideDescription = true;
        }
      });
    },
    checkVisibleCommentaire(reserve) {
      const routeName = this.$route.name;
      if(this.action === 'add')
      {
        this.hideReservation.hideCommentaire = false;
      }
      else if(this.action === 'edit')
      {
        if(reserve.utilisateur.id === this.userLogged.id
          && routeName === 'ReserveListUser'
          && reserve.commentaire !== null
          && reserve.commentaire !== ""
        ){
          console.log(reserve.commentaire);
          this.hideReservation.hideCommentaire = true;
          this.disabledReservation.disabledCommentaire = true;
        }
      }
      else if (this.action === 'editCommentaire')
      {
        this.hideReservation.hideCommentaire = true;

        if(reserve.status > 1) {
          this.disabledReservation.disabledCommentaire = true;
        } else {
          this.disabledReservation.disabledCommentaire = false;
        }
      }
    },
    initializeData(reserve) {
      this.initialDateStart = moment(reserve.dateDebut).format('YYYY-MM-DD');
      this.initialDateEnd = moment(reserve.dateFin).format('YYYY-MM-DD');
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
      this.formReservation.commentaire = reserve.commentaire;
    },
    async getVehiculesBySite(editReserve) {
      let userSiteId = null;
      if (this.action === 'edit' || this.action === 'editCommentaire') {
        userSiteId = editReserve.utilisateur.site.id;
      }
      this.vehiculeOptions = await api.url(`/api/Vehicules/GetVehiculesBySite/${userSiteId}`)
        .headers({'Authorization': 'Bearer ' + this.token})
        .get()
        .json();
    },
    async getVehiculeNonResaBySiteAndDate(dateDebut,dateFin) {
      const userSiteId = this.userLogged.site.id;
      this.initialDateStart = dateDebut;
      this.initialDateEnd = dateFin;

      await api.url(`/api/Vehicules/GetVehiculesNonResaBySiteAndDate/${userSiteId}/${dateDebut}/${dateFin}`)
        .headers({'Authorization': 'Bearer ' + this.token})
        .get()
        .json()
        .then(data => {
          if(data.length === 0) {
            this.vehiculeOptions = [];
            this.vehiculeErreur = false;
          } else {
            this.vehiculeOptions = data;
            this.vehiculeErreur = null;
            this.getPersonnelsBySite();
          }
        });
    },
    async getPersonnelsBySite(editReserve) {
      let userSiteId = null;
      if(this.action === 'add') {
        userSiteId = this.userLogged.site.id;
      } else if (this.action === 'edit' || this.action === 'editCommentaire') {
        userSiteId = editReserve.utilisateur.site.id;
      }
        await api.url(`/api/Personnel/GetPersonnelsBySite/${userSiteId}`)
          .headers({'Authorization': 'Bearer ' + this.token})
          .get()
          .json()
          .then(data => {
            data.forEach((d) => {
              if(d.id !== this.userLogged.id) {
                this.personnelsOptions.push(d);
              }
            });
          });
    },
    async getFullReservedDays(date, array) {
      const userSiteId = this.userLogged.site.id;

      await api.url(`/api/Reservations/GetFullReservedDays/${userSiteId}/${date}`)
        .headers({'Authorization': 'Bearer ' + this.token})
        .get()
        .json()
        .then(data => {
          array.push(data);
        });
    },
  },
  computed: {
    ...mapGetters(['isAdmin', 'userLogged']),
  },
  mounted() {

  }
};
