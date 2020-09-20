<template>
  <div class="modals">
    <template>
      <b-modal
        id="modal-notification"
        ref="modalNotification"
        title="Veuillez confirmer"
        header-bg-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        @hidden="resetModalNotification"
        @ok="okModalNotification"
        centered
      >
        <template slot="modal-title">
          <template v-if="!formReservationNotification.isRejeted">
            <h5>Historique des échanges</h5>
          </template>
          <template v-else>
            <h5>Rejeté la réservation</h5>
          </template>
        </template>
        <p v-if="formReservationNotification.isRejeted">Veuillez confirmer que vous souhaitez annulé cette réservation.</p>
        <b-list-group class="notif-scroll">
          <template v-for="(n) in listNotification">
            <b-list-group-item
              v-bind:key="n.id"
              class="flex-column align-items-start"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ dateNotification(n.dateNotif) }}</h5>
                <span>
                  <b-badge v-if="n.typeNotif === 1" variant="info">Info</b-badge>
                  <b-badge v-if="n.typeNotif === 2" variant="success">Validé</b-badge>
                  <b-badge v-if="n.typeNotif === 3" variant="danger">Rejeté</b-badge>
                  <b-badge v-if="n.typeNotif === 4" variant="dark">Clôturé</b-badge>
                </span>
              </div>
              <p class="mb-1">
                {{ n.commentaire }}
              </p>
            </b-list-group-item>
          </template>
          <b-list-group-item
            v-if="listNotification.length === 0"
            class="flex-column align-items-start"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Aucun commentaire</h5>
            </div>
          </b-list-group-item>
        </b-list-group>
        <form ref="form-notification"
          class="mt-3"
          @submit.stop.prevent="submitModalNotification"
          v-if="formReservationNotification.isVisible">
          <b-form-group
            label="Ajouter un commentaire"
            label-for="reserve-commentaire"
          >
            <b-form-textarea
              id="reserve-commentaire"
              v-model="formReservationNotification.commentaire"
              required
            ></b-form-textarea>
          </b-form-group>
        </form>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <template v-if="formReservationNotification.disabled">
            <b-button @click="cancel" variant="danger" >Fermer</b-button>
          </template>
          <template v-else>
            <b-button @click="cancel" variant="danger">Annuler</b-button>
            <b-button @click="ok" variant="primary">Valider</b-button>
          </template>
        </template>
      </b-modal>
    </template>
    <template>
      <b-modal
        id="modal-valider"
        ref="modalValider"
        title="Veuillez confirmer"
        header-bg-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        @hidden="resetModalValider"
        @ok="okModalValider"
        centered
      >
        <template slot="modal-title">
          <h5>Veuillez confirmer</h5>
        </template>
        <p>Veuillez confirmer que vous souhaitez validé cette réservation.</p>
        <form ref="form" @submit.stop.prevent="submitModalValider">
          <b-form-group
            label="Clé de la voiture"
            label-for="reserve-voiture-cle"
            invalid-feedback=""
          >
            <b-form-select
              id="reserve-voiture-cle"
              v-model="formReservationValider.idCle"
              value-field="id"
              text-field="modele_voiture">
              <b-form-select-option :value="null" disabled>-- Choix de la clé --</b-form-select-option>
              <b-form-select-option v-for="(carCle) in formReservationValider.cles" v-bind:key="carCle.id" :value="carCle.id">
                {{ carCle.libelle }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </form>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button @click="cancel" variant="danger">Annuler</b-button>
          <b-button @click="ok" variant="primary">Valider</b-button>
        </template>
      </b-modal>
    </template>
  </div>
</template>


<script type="application/javascript" src="./AppReservationAction.js"></script>
