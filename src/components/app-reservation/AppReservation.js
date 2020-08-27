import moment from 'moment';
import Multiselect from 'vue-multiselect';
import { mapGetters } from 'vuex';

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
      ],
      vehiculeOptions: [
        {id: '49a46fa6-007f-42cd-9319-23eb0c012c14', modele: 'Clio 1', nbPlaces: 5},
        {id: '1fa6da4d-8d86-4499-86f5-efb0bf7114ab', modele: 'Clio 2', nbPlaces: 5},
      ],
      vehiculeCle: [
        {id: '975938d6-8599-4384-b5c3-9d6ec159f755', libelle: 'Clé bleu'},
        {id: '93cef5b6-9231-44bb-bf88-e54a7107c7cf', libelle: 'Clé Rouge'},
      ],
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
      contact: ''
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
      this.formReservation.idCle = '';
      this.formReservation.personnels = [];
      this.formReservation.siteDestination = '';
      this.formReservation.description = '';
      this.formReservation.status = '';
    },
    editModalReserve(reserve) {
      this.cTitleReserveModal = 'Réservation de ' + reserve.utilisateur.nom + reserve.utilisateur.prenom;
      this.contact = reserve.utilisateur.mail;
      this.$bvModal.show("modal-reservation");

      if (reserve.status > 1) {
        this.formReservation.disabled = true;
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
      console.log(reserve);
      console.log(JSON.stringify(reserve));

    },
    deleteModalReserve(reserve) {
      this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez supprimer cette réservation.', {
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
        .then(value => {
          console.log(value);
          console.log(reserve);
        })
        .catch(err => {
          console.log(err);
        })
    },
    validateModalReserve(reserve) {
      this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez valider cette réservation.', {
        title: 'Veuillez confirmer',
        size: 'md',
        buttonSize: 'md',
        okVariant: 'primary',
        cancelVariant: 'danger',
        okTitle: 'Valider',
        cancelTitle: 'Annuler',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true,
      })
        .then(value => {
          console.log(value);
          console.log(reserve);
        })
        .catch(err => {
          console.log(err);
        })
    },
    cloturerModalReserve(reserve) {
      this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez clôturer cette réservation.', {
        title: 'Veuillez confirmer',
        size: 'md',
        buttonSize: 'md',
        okVariant: 'primary',
        cancelVariant: 'danger',
        okTitle: 'Valider',
        cancelTitle: 'Annuler',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true,
      })
        .then(value => {
          console.log(value);
          console.log(reserve);
        })
        .catch(err => {
          console.log(err);
        })
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
    editModalAnnuler(reserve) {
      this.$bvModal.show("modal-annuler");

      if (reserve.status === 2 || reserve.status === 3) {
        this.formReservation.disabled = true;
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
      this.formReservation.commentaire = reserve.commentaire;
      this.formReservation.status = reserve.status;

      console.log(JSON.stringify(reserve));
    },
    resetModalAnnuler() {
      this.formReservation.disabled = false;
      this.formReservation.commentaire = '';
    },
    okModalAnnuler(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalAnnuler()
    },
    submitModalAnnuler() {
      console.log(JSON.stringify(this.formReservation));
    },

  },
  computed: {
    ...mapGetters(['isAdmin']),
  },
  mounted() {
  }
};
