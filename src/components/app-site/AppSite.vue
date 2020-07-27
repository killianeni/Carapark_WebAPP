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
        <div class="text-right">
          <b-button-group v-if="typePage === 'park'">
            <router-link :to="{ name: 'ParkCar', params: { id: dataSite.id }}" class="btn btn-dark">
              <i class="kmap-icons icon-see"></i>
            </router-link>
            <b-button variant="primary" @click="editSite(dataSite)">
              <i class="kmap-icons icon-edit"></i>
            </b-button>
            <b-button variant="danger" @click="deleteSite(dataSite)">
              <i class="kmap-icons icon-delete"></i>
            </b-button>
          </b-button-group>
          <b-button-group v-if="typePage === 'user'">
            <router-link :to="{ name: 'UserList', params: { id: dataSite.id }}" class="btn btn-dark">
              <i class="kmap-icons icon-see"></i>
            </router-link>
          </b-button-group>
        </div>
      </b-card>
    </div>
    <template v-if="typePage === 'park'">
      <b-modal
        id="modal-site"
        ref="modal"
        title="Ajouter un site"
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
        <form ref="form" @submit.stop.prevent="submitSite">
          <b-form-group
            label="Libelle"
            label-for="name-input"
            invalid-feedback="Name is required"
          >
            <b-form-input
              id="name-input"
              v-model="form.libelle"
              required
            ></b-form-input>
          </b-form-group>
        </form>
      </b-modal>
    </template>
  </div>
</template>

<script lang="js" src="./AppSite.js"></script>
