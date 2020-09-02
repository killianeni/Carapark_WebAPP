export default {
  name: 'AppReservationAction',
  data() {
    return {
      formReservationAnnulee: {
        disabled: false,
        commentaire: '',
      }
    }
  },
  methods: {
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
    editModalAnnuler(reserve) {
      this.$bvModal.show("modal-annuler");
      console.log(this.formReservationAnnulee);
      console.log(JSON.stringify(reserve));
    },
    seeModalAnnuler(reserve) {
      this.formReservationAnnulee.disabled = true;
      this.formReservationAnnulee.commentaire = reserve.commentaire;
      this.$bvModal.show("modal-annuler");
    },
    resetModalAnnuler() {
      this.formReservationAnnulee.disabled = false;
      this.formReservationAnnulee.commentaire = '';
    },
    okModalAnnuler(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalAnnuler()
    },
    submitModalAnnuler() {
      console.log(JSON.stringify(this.formReservationAnnulee));
    },
  },

}
