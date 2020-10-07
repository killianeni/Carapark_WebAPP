<template>
  <div class="row">
    <div class="col-12 col-md-4" v-for="(dataSite) in dataSites" :key="dataSite.site">
      <b-card bg-variant="light" class="mb-3">
        <b-card-title>
          Site - {{ dataSite.libelle }}
        </b-card-title>
        <b-card-text v-if="typePage === 'park'">
          Nombre de voitures : {{ dataSite.nbVehicules }}
        </b-card-text>
        <b-card-text v-if="typePage === 'user'">
          Nombre d'utilisateur : {{ dataSite.nbUtilisateurs }}
        </b-card-text>
        <b-card-text v-if="typePage === 'reservation'">
          Nombre de réservation : {{ dataSite.nbReservations }}
        </b-card-text>
        <div class="text-right">
          <b-button-group v-if="typePage === 'park'">
            <router-link
              :to="{ name: 'ParkCar', params: { id: dataSite.id }}"
              class="btn btn-dark"
            >
              <i class="kmap-icons icon-see" />
            </router-link>
            <b-button variant="primary" @click="editSiteModal(dataSite)">
              <i class="kmap-icons icon-edit" />
            </b-button>
            <b-button
              variant="danger"
              @click="deleteSiteModal(dataSite)"
              :disabled="checkCanDelete(dataSite)"
            >
              <i class="kmap-icons icon-delete" :id="'delete-site-' + dataSite.id" />
            </b-button>
            <b-popover
              :target="'delete-site-' + dataSite.id"
              triggers="hover"
              placement="top"
              v-if="checkCanDelete(dataSite)"
            >
              <template v-slot:title>
                Condition de suppression
              </template>
              Veuillez supprimer les éléments suivants en liens :
              <ul>
                <li v-if="dataSite.nbUtilisateurs">
                  Utilisateurs
                </li>
                <li v-if="dataSite.nbReservations">
                  Réservations
                </li>
                <li v-if="dataSite.nbVehicules">
                  Véhicules
                </li>
              </ul>
            </b-popover>
          </b-button-group>
          <b-button-group v-if="typePage === 'user'">
            <router-link
              :to="{ name: 'UserList', params: { id: dataSite.id }}"
              class="btn btn-dark"
            >
              <i class="kmap-icons icon-see" />
            </router-link>
          </b-button-group>
          <b-button-group v-if="typePage === 'reservation'">
            <router-link
              :to="{ name: 'ReserveListSite', params: { id: dataSite.id }}"
              class="btn btn-dark"
            >
              <i class="kmap-icons icon-see" />
            </router-link>
          </b-button-group>
        </div>
      </b-card>
    </div>
    <template v-if="typePage === 'park'">
      <b-modal
        id="modal-site"
        ref="modal"
        :title="titleSiteModal"
        cancel-title="Annuler"
        ok-title="Valider"
        cancel-variant="danger"
        ok-variant="primary"
        header-bg-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        @hidden="resetModal"
        @ok="okSite"
        centered
      >
        <form ref="formSite" @submit.stop.prevent="submitSite">
          <b-form-group
            label="Libelle"
            label-for="name-input"
            invalid-feedback="Name is required"
          >
            <b-form-input
              id="name-input"
              v-model="formSite.libelle"
              required
            />
          </b-form-group>
        </form>
      </b-modal>
    </template>
  </div>
</template>

<script lang="js" src="./AppSite.js"></script>
