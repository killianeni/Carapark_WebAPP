//import moment from 'moment';
import Multiselect from 'vue-multiselect';

export default {
  name: 'AppReservation',
  components: {
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
      formReservation: {
        dateStart: '',
        reserveTimeStart: '',
        dateEnd: '',
        reserveTimeEnd: '',
        idVehicule: '',
        passagers: [],
        destination: '',
        description: ''
      },
      cTitleReserveModal: '',
      initialDateStart: '',
      initialDateEnd: ''
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
      this.cTitleReserveModal = '';
      this.initialDateStart = '';
      this.initialDateEnd = '';
      this.formReservation.dateStart = '';
      this.formReservation.reserveTimeStart = '';
      this.formReservation.dateEnd = '';
      this.formReservation.reserveTimeEnd = '';
      this.formReservation.idVehicule = '';
      this.formReservation.passagers = [];
      this.formReservation.destination = '';
      this.formReservation.description = '';
    },
    editModalReserve(reserve) {
      this.cTitleReserveModal = 'Réservation de ' + reserve.utilisateur.nom + reserve.utilisateur.prenom;
      this.$bvModal.show("modal-reservation");
      this.initialDateStart = reserve.dateStart.format('YYYY-MM-DD');
      this.initialDateEnd = reserve.dateEnd.format('YYYY-MM-DD');
      this.formReservation.dateStart = reserve.dateStart.format('DD/MM/YYYY');
      this.formReservation.reserveTimeStart = reserve.reserveTimeStart;
      this.formReservation.dateEnd = reserve.dateEnd.format('DD/MM/YYYY');
      this.formReservation.reserveTimeEnd = reserve.reserveTimeEnd;
      this.formReservation.idVehicule = reserve.idVehicule;
      this.formReservation.passagers = reserve.passagers;
      this.formReservation.destination = reserve.destination;
      this.formReservation.description = reserve.description;
      console.log(JSON.stringify(reserve));
    },
    onContextDateStart(ctxS) {
      if(ctxS.selectedDate != null) {
        this.formReservation.dateStart = ctxS.activeFormatted;
      }
    },
    onContextDateEnd(ctxE) {
      if(ctxE.selectedDate != null) {
        this.formReservation.dateEnd = ctxE.activeFormatted;
      }
    },
    dateDisabled(ymd, date) {
      const weekday = date.getDay();
      const day = date.getDate();
      // Exemple
      return weekday === 0 || weekday === 6 || day === 13;
    },
    shown(){
      console.log("Open");
    },
  },
  mounted() {
  }
};
