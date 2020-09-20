import moment from 'moment';
import {api} from "@/config";

export default {
  name: 'AppReservationAction',
  data() {
    return {
      token: localStorage.getItem('user-token'),
      listNotification: [],
      formReservationNotification: {
        currentReserve: '',
        disabled: false,
        isVisible: true,
        isRejeted: false,
        commentaire: '',
      },
      formReservationValider: {
        id: null,
        idCle: '',
        cles: []
      }
    }
  },
  methods: {
    deleteModalReserve(reserve) {
      this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez annuler cette réservation.', {
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
          if (value) {
            const idReservation = reserve.id;
            const bodyReservation = {
              'confirmationCle': false,
              'isRejeted': true,
              'isAccepted': false,
            };
            const modalName = null;

            this.updateReservationStatut(idReservation, bodyReservation, modalName)
          }
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
          if (value) {
            const idReservation = reserve.id;
            const bodyReservation = {
              'confirmationCle': true,
              'isRejeted': false,
              'isAccepted': false,
            };
            const modalName = null;

            this.updateReservationStatut(idReservation, bodyReservation, modalName)
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    annulerModalNotification(idReserve) {
      console.log(idReserve);
      this.formReservationNotification.isRejeted = true;
      this.$bvModal.show("modal-notification");
      console.log(this.formReservationNotification);
    },
    addModalNotification(reserve) {
      this.formReservationNotification.currentReserve = reserve;
      this.getNotificationsByReservation(reserve.id);
      this.$bvModal.show("modal-notification");
    },
    infoModalNotification(reserve) {
      this.getNotificationsByReservation(reserve.id);
      this.formReservationNotification.currentReserve = reserve;
      this.formReservationNotification.disabled = true;
      this.formReservationNotification.isVisible = false;
      this.$bvModal.show("modal-notification");
    },
    resetModalNotification() {
      this.formReservationNotification.currentReserve = '';
      this.formReservationNotification.disabled = false;
      this.formReservationNotification.isVisible = true;
      this.formReservationNotification.isRejeted = false;
      this.formReservationNotification.commentaire = '';
    },
    okModalNotification(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalNotification()
    },
    submitModalNotification() {
      if(this.formReservationNotification.commentaire)
      {
        const reserve = this.formReservationNotification.currentReserve;
        const bodyNotif = {
          idUser: reserve.utilisateur.id,
          idResa: reserve.id,
          typeNotif: 3,
          commentaire: this.formReservationNotification.commentaire,
          checked: false
        };
        this.addCommmentNotif(bodyNotif);
      }
    },
    dateNotification(dateNotif) {
      return moment(dateNotif).format("DD/MM/YYYY HH:mm:ss");
    },
    editModalValider(reserve) {
      this.formReservationValider.id = reserve.id;
      this.formReservationValider.cles = reserve.vehicule.cles;
      this.$bvModal.show("modal-valider");
    },
    resetModalValider() {
      this.formReservationValider.id = null;
      this.formReservationValider.idCle = '';
      this.formReservationValider.cles = [];
    },
    okModalValider(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalValider()
    },
    submitModalValider() {
      const idReservation = this.formReservationValider.id;
      const bodyReservation = {
        'cle': {
          'id': this.formReservationValider.idCle
        },
        'confirmationCle': false,
        'isRejeted': false,
        'isAccepted': true,
      };
      const modalName = 'modal-valider';

      this.updateReservationStatut(idReservation, bodyReservation, modalName)
    },
    async updateReservationStatut(idReservation, bodyReservation, modalName) {
      await api.url(`/api/Reservations/${idReservation}`)
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .put(bodyReservation)
        .badRequest(err => console.log(err))
        .res(r => {
          if (r.ok === true && this.$route.name === 'ReserveListSite') {
            this.$parent.getReservationsBySite();
            if (modalName) {
              this.$bvModal.hide(modalName);
            }
          }

          if (r.ok === true && this.$route.name === 'ReserveListUser') {
            this.$parent.getReservationsByUser();
            if (modalName) {
              this.$bvModal.hide(modalName);
            }
          }
        });
    },
    async addCommmentNotif(bodyNotif) {
      await api.url('/api/Notifications/AddCommentNotif')
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .post(bodyNotif)
        .badRequest(err => console.log(err))
        .res(r => {
          console.log(r);
          if(r.ok === true) {
            this.$bvModal.hide('modal-notification');
          }
        });
    },
    async getNotificationsByReservation(idReservation) {
      await api.url(`/api/Notifications/GetNotificationsByReservation/${idReservation}`)
        .headers({'Authorization': 'Bearer ' + this.token})
        .get()
        .json()
        .then(data => {
          this.listNotification = [];
          data.forEach((d) => {
            this.listNotification.push(d);
          });
        });
    }
  }
}
