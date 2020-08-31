<template>
  <div class="modals">
    <b-modal
      id="modal-reservation"
      :title="cTitleReserveModal"
      header-bg-variant="light"
      body-bg-variant="light"
      footer-bg-variant="light"
      cancel-title="Annuler"
      ok-title="Valider"
      cancel-variant="danger"
      ok-variant="primary"
      @hidden="resetModalReserve"
      @ok="okModalReserve"
    >
      <form
        ref="formReservation"
        class="user-reservation"
        @submit.stop.prevent="submitModalReserve">
        <b-form-group
          label="Date"
          label-for="reserve-dateDebut"
          invalid-feedback=""
        >
          <b-input-group class="mb-3">
            <b-form-input
              id="reserve-dateDebut"
              v-model="formReservation.dateDebut"
              readonly
              required
            ></b-form-input>
            <b-input-group-append>
              <b-form-datepicker
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                aria-controls="reserve-dateDebut"
                :initial-date="initialDateStart"
                button-only
                right
                locale="fr"
                @context="onContextDateStart"
                :date-disabled-fn="dateDisabled"
                @shown="shown"
                selected-variant="success"
                today-variant="danger"
                button-variant="primary"
                hide-header
                :disabled="formReservation.disabled"
              >
              </b-form-datepicker>
            </b-input-group-append>
          </b-input-group>
          <b-form-select
            id="reserve-timeStart"
            v-model="formReservation.timeStart"
            :disabled="formReservation.disabled"
            required
          >
            <b-form-select-option :value="null" disabled>
              -- Choix de la zone horaire --
            </b-form-select-option>
            <b-form-select-option value="AM">
              Matin
            </b-form-select-option>
            <b-form-select-option value="PM">
              Après-midi
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
        <b-form-group
          label="Date Fin"
          label-for="reserve-dateFin"
          invalid-feedback=""
        >
          <b-input-group class="mb-3">
            <b-form-input
              id="reserve-dateFin"
              v-model="formReservation.dateFin"
              readonly
              required
            ></b-form-input>
            <b-input-group-append>
              <b-form-datepicker
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                aria-controls="reserve-dateFin"
                :initial-date="initialDateEnd"
                button-only
                right
                locale="fr"
                @context="onContextDateEnd"
                :date-disabled-fn="dateDisabled"
                selected-variant="success"
                today-variant="danger"
                button-variant="primary"
                hide-header
                :disabled="formReservation.disabled"
              ></b-form-datepicker>
            </b-input-group-append>
          </b-input-group>
          <b-form-select
            id="reserve-timeEnd"
            v-model="formReservation.timeEnd"
            :disabled="formReservation.disabled"
            required
          >
            <b-form-select-option :value="null" disabled>
              -- Choix de la zone horaire --
            </b-form-select-option>
            <b-form-select-option value="AM">
              Matin
            </b-form-select-option>
            <b-form-select-option value="PM">
              Après-midi
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
        <b-form-group
          label="Voiture"
          label-for="reserve-voiture"
          invalid-feedback=""
        >
          <b-form-select
            id="reserve-voiture"
            v-model="formReservation.idVehicule"
            :disabled="formReservation.disabled"
            value-field="id"
            @change="selectVoiture"
            text-field="modele_voiture">
            <b-form-select-option :value="null" disabled>-- Choix de la voiture --</b-form-select-option>
            <b-form-select-option v-for="(car) in vehiculeOptions" v-bind:key="car.id" :value="car.id">
              {{ car.modele }} - {{ car.nbPlaces }} places
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
        <b-form-group v-if="formReservation.status === 2 || formReservation.status  === 4"
          label="Voiture Clé"
          label-for="reserve-voiture-cle"
          invalid-feedback=""
        >
          <b-form-select
            id="reserve-voiture-cle"
            v-model="formReservation.idCle"
            :disabled="formReservation.disabled"
            value-field="id"
            text-field="modele_voiture">
            <b-form-select-option :value="null" disabled>-- Choix de la clé --</b-form-select-option>
            <b-form-select-option v-for="(carCle) in vehiculeCle" v-bind:key="carCle.id" :value="carCle.id">
              {{ carCle.libelle }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
        <b-form-group
          label="Liste des passagers"
          label-for="reserve-passager"
          invalid-feedback=""
        >
          <multiselect
            id="reserve-passager"
            v-model="formReservation.personnels"
            placeholder="Rechercher un utilisateur"
            label="name"
            track-by="id"
            deselectLabel="Supprimer"
            selectLabel="Sélectionner"
            selectedLabel="Sélectionné"
            :options="personnelsOptions"
            :multiple="true"
            :max=maxPersonnel
            :custom-label="customLabel"
            :optionsLimit=10
            :disabled="formReservation.disabled"
          >
            <template slot="option" slot-scope="props">
              <div class="option-list-user">
                <b-avatar variant="primary"></b-avatar>
                <div class="nom-prenom">{{ props.option.nom }} {{ props.option.prenom }}</div>
              </div>
            </template>
            <span slot="noResult">Aucun utilisateur trouvé</span>
            <span slot="maxElements">Voiture complète</span>
          </multiselect>
        </b-form-group>
        <b-form-group
          label="Destination"
          label-for="reserve-siteDestination"
          invalid-feedback=""
        >
          <b-form-input
            id="reserve-siteDestination"
            v-model="formReservation.siteDestination"
            :disabled="formReservation.disabled"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Description"
          label-for="reserve-description"
          invalid-feedback=""
        >
          <b-form-textarea
            id="description"
            v-model="formReservation.description"
            :disabled="formReservation.disabled"
            rows="3"
            max-rows="4"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group v-if="hideFormField"
          label="Commentaire"
          label-for="reserve-commentaire"
          invalid-feedback=""
        >
          <b-form-textarea
            id="commentaire"
            v-model="formReservation.commentaire"
            :disabled="commentaireDisabled"
            rows="3"
            max-rows="4"
          ></b-form-textarea>
        </b-form-group>
        <div id="contact" class="d-flex align-items-center" v-if="contact">
        <span class="contact mr-3">
            <i class="kmap-icons icon-contact"></i>
        </span>
          {{ contact }}
        </div>
      </form>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <template v-if="formReservation.disabled">
          <b-button @click="cancel" variant="danger" >Fermer</b-button>
        </template>
        <template v-else>
          <b-button @click="cancel" variant="danger">Annuler</b-button>
          <b-button @click="ok" variant="primary">Valider</b-button>
        </template>
      </template>
    </b-modal>
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
          <template v-if="formReservation.disabled">
            <h5>Raison du refus</h5>
          </template>
          <template v-else>
            <h5>Veuillez confirmer</h5>
          </template>
        </template>
        <p v-if="!formReservation.disabled">Veuillez confirmer que vous souhaitez annulé cette réservation.</p>
        <form ref="form" @submit.stop.prevent="submitModalAnnuler">
          <b-form-group
            label="Commentaire"
            label-for="reserve-commentaire"
          >
            <b-form-textarea
              id="reserve-commentaire"
              v-model="formReservation.commentaire"
              :disabled="formReservation.disabled"
              required
            ></b-form-textarea>
          </b-form-group>
        </form>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <template v-if="formReservation.disabled">
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

<script type="application/javascript" src="./AppReservation.js"></script>
<style lang="scss" src="./AppReservation.scss" rel="stylesheet"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
