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
      personnelsOptions: [
        {id: '62b473a0-91f0-4e6f-bea7-1953ac199157', mail: 'martine.alaplage@eni.fr', nom: 'ALAPLAGE', prenom: 'Martine' },
        {id: '27a51826-0f74-42f0-b3a7-3f51246545e6', mail: 'jean.bon@eni.fr', nom: 'BON', prenom: 'Jean' },
        {id: '27a51826-0f74-42f0-b3a7-121212112151', mail: 'jean.bon@eni.fr', nom: 'BON2', prenom: 'Jean2' },
        {id: '27a51826-0f74-42f0-b3a7-121212051451', mail: 'jean.bon@eni.fr', nom: 'BON', prenom: 'Jean3' },
      ],
      vehiculeOptions: [],
      vehiculeCle: [],
      maxPersonnel: 0,
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
      },
      disabledReservation: {
        disabledVehicule: '',
        disabledPersonnels: '',
        disabledSiteDestination: '',
        disabledCommentaire: '',
      },
    }
  },
  methods: {
    customLabel({nom, prenom}) {
      return `${nom} – ${prenom}`
    },
    okModalReserve(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalReserve()
    },
    submitModalReserve() {
      console.log(JSON.stringify(this.formReservation));
      /*this.$nextTick(() => {
        this.$bvModal.hide('modal-reservation');
      })*/
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
    },
    addModalReserve() {
      this.action = 'add';
      this.checkVisibleCommentaire();
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
      this.checkVisibleCommentaire(reserve);

      this.$bvModal.show("modal-reservation");

      if (reserve.status > 1) {
        this.formReservation.disabled = true;
        this.vehiculeOptions = [reserve.vehicule];
        this.vehiculeCle = reserve.vehicule.cles;
      } else {
        this.getVehiculesBySite(reserve);
        this.vehiculeCle = reserve.vehicule.cles;
      }
      this.initialDateStart = moment(reserve.dateDebut).format('YYYY-MM-DD');
      this.initialDateEnd = moment(reserve.dateFin).format('YYYY-MM-DD');
      this.formReservation.dateDebut = moment(reserve.dateDebut).format('DD/MM/YYYY');
      this.formReservation.timeStart = reserve.timeStart;
      this.formReservation.dateFin = moment(reserve.dateFin).format('DD/MM/YYYY');
      this.formReservation.timeEnd = reserve.timeEnd;
      this.formReservation.idVehicule = reserve.vehicule.id;
      this.formReservation.idCle = reserve.cle.id;
      this.formReservation.personnels = reserve.personnels;
      this.formReservation.siteDestination = reserve.siteDestination;
      this.formReservation.description = reserve.description;
      this.formReservation.status = reserve.status;
      this.formReservation.commentaire = reserve.commentaire;
    },
    editCommentaireModalReserve(reserve) {
      this.action = 'editCommentaire';
      this.hideReservation.hideVehicule = true;
      this.hideReservation.hidePersonnels = true;
      this.hideReservation.hideSiteDestination = true;
      this.hideReservation.hideDescription = true;
      this.formReservation.disabled = true;
      this.checkVisibleCommentaire(reserve);

      this.$bvModal.show("modal-reservation");

      this.getVehiculesBySite(reserve);
      this.vehiculeCle = reserve.vehicule.cles;
      this.initialDateStart = moment(reserve.dateDebut).format('YYYY-MM-DD');
      this.initialDateEnd = moment(reserve.dateFin).format('YYYY-MM-DD');
      this.formReservation.dateDebut = moment(reserve.dateDebut).format('DD/MM/YYYY');
      this.formReservation.timeStart = reserve.timeStart;
      this.formReservation.dateFin = moment(reserve.dateFin).format('DD/MM/YYYY');
      this.formReservation.timeEnd = reserve.timeEnd;
      this.formReservation.idVehicule = reserve.vehicule.id;
      this.formReservation.idCle = reserve.cle.id;
      this.formReservation.personnels = reserve.personnels;
      this.formReservation.siteDestination = reserve.siteDestination;
      this.formReservation.description = reserve.description;
      this.formReservation.status = reserve.status;
      this.formReservation.commentaire = reserve.commentaire;

    },
    onContextDateStart(ctxS) {
      if (ctxS.selectedDate != null) {
        this.formReservation.dateDebut = ctxS.activeFormatted;
      }
    },
    onContextDateEnd(ctxE) {
      if (ctxE.selectedDate != null) {
        this.formReservation.dateFin = ctxE.activeFormatted;
      }
    },
    dateDisabled(ymd, date) {
      //const weekday = date.getDay();
      const day = date.getDate();
      // Exemple
      return day === 13;
    },
    shown() {
      console.log("Open");
    },
    async getVehiculesBySite(editReserve) {
      let userSiteId = null;
      if(this.action === 'add') {
        userSiteId = this.userLogged.site.id;
      } else if (this.action === 'edit' || this.action === 'editCommentaire') {
        userSiteId = editReserve.utilisateur.site.id;
      }
      const token = localStorage.getItem('user-token');
      this.vehiculeOptions = await api.url(`/api/Vehicules/GetVehiculesBySite/${userSiteId}`)
        .headers({"Authorization": "Bearer " + token})
        .get()
        .json();
    },
    async getVehiculeNonResaBySiteAndDate(dateDebut,dateFin) {
      const userSiteId = this.userLogged.site.id;
      const token = localStorage.getItem('user-token');

      this.vehiculeOptions = await api.url(`/api/Vehicules/GetVehiculeNonResaBySiteAndDate/${userSiteId}/${dateDebut}/${dateFin}`)
        .headers({"Authorization": "Bearer " + token})
        .get()
        .json();
    },
    selectDate() {
      if(this.action === 'add') {
        const dD = this.formReservation.dateDebut;
        const dF = this.formReservation.dateFin;
        const tS = this.formReservation.timeStart;
        const tE = this.formReservation.timeEnd;
        const dateInfo = {
          'dateD': null,
          'dateF': null,
        };

        if(dD !== ''
          && dF !== ''
          && tS !== ''
          && tE !== '')
        {
          dateInfo.dateD = tS === 'AM' ? moment(dD).format('YYYY-MM-DD 09:00:00') : moment(dD).format('YYYY-MM-DD 15:00:00');
          dateInfo.dateF = tE === 'AM' ? moment(dF).format('YYYY-MM-DD 09:00:00') : moment(dF).format('YYYY-MM-DD 15:00:00');

          this.getVehiculeNonResaBySiteAndDate(dateInfo.dateD, dateInfo.dateF);
          this.hideReservation.hideVehicule = true;
        }
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
          && routeName === 'Dashboard'
          && reserve.commentaire !== null
        ){
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
    getFormReservation() {
      return [this.formReservation];
    }
  },
  computed: {
    ...mapGetters(['isAdmin', 'userLogged']),
  },
  mounted() {

  }
};
