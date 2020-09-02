<template>
  <div class="modals">
    <template>
      <b-modal
        id="modal-annuler"
        ref="modal"
        title="Veuillez confirmer"
        cancel-title="Annuler"
        ok-title="Valider"
        header-bg-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        @hidden="resetModalAnnuler"
        @ok="okModalAnnuler"
        centered
      >
        <template slot="modal-title">
          <template v-if="formReservationAnnulee.disabled">
            <h5>Raison du refus</h5>
          </template>
          <template v-else>
            <h5>Veuillez confirmer</h5>
          </template>
        </template>
        <p v-if="!formReservationAnnulee.disabled">Veuillez confirmer que vous souhaitez annulé cette réservation.</p>
        <form ref="form" @submit.stop.prevent="submitModalAnnuler">
          <b-form-group
            label="Commentaire"
            label-for="reserve-commentaire"
          >
            <b-form-textarea
              id="reserve-commentaire"
              v-model="formReservationAnnulee.commentaire"
              :disabled="formReservationAnnulee.disabled"
              required
            ></b-form-textarea>
          </b-form-group>
        </form>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <template v-if="formReservationAnnulee.disabled">
            <b-button @click="cancel" variant="danger" >Fermer</b-button>
          </template>
          <template v-else>
            <b-button @click="cancel" variant="danger">Annuler</b-button>
            <b-button @click="ok" variant="primary">Valider</b-button>
          </template>
        </template>
      </b-modal>
    </template>
  </div>
</template>


<script type="application/javascript" src="./AppReservationAction.js"></script>
