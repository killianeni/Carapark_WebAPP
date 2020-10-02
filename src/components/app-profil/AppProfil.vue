<template>
  <b-modal
    id="modal-profil"
    ref="modalprofil"
    header-bg-variant="light"
    body-bg-variant="light"
    footer-bg-variant="light"
    @hidden="resetModalProfil"
    @ok="okModalProfil"
    centered
  >
    <template slot="modal-title">
      <h5>Profil utilisateur</h5>
    </template>
    <b-form>
      <b-form-group
        label="Nom"
        label-for="profil-nom"
      >
        <b-form-input
          id="profil-nom"
          v-model="form.nom"
          disabled
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Prénom"
        label-for="profil-prenom"
      >
        <b-form-input
          id="profil-prenom"
          v-model="form.prenom"
          disabled
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Mail"
        label-for="profil-mail"
      >
        <b-form-input
          id="profil-mail"
          v-model="form.mail"
          disabled
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Ancien mot de passe"
        label-for="profil-oldPass"
      >
        <b-form-input
          id="profil-oldPass"
          type="password"
          :state="emptyPassError.oldPass"
          v-model="form.oldPass"
        ></b-form-input>
        <b-form-invalid-feedback :state="emptyPassError.oldPass">
          Valeur obligatoire
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        label="Nouveau Mot de passe"
        label-for="profil-newPass"
      >
        <b-form-input
          id="profil-newPass"
          type="password"
          :state="emptyPassError.newPass"
          v-model="form.newPass"
        ></b-form-input>
        <b-form-invalid-feedback :state="emptyPassError.newPass">
          Valeur obligatoire
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        label="Confirmation Mot de passe"
        label-for="profil-confirmPass"
      >
        <b-form-input
          id="profil-confirmPass"
          type="password"
          :state="emptyPassError.confirmPass"
          v-model="form.confirmPass"
        ></b-form-input>
        <b-form-invalid-feedback :state="emptyPassError.confirmPass">
          Valeur obligatoire
        </b-form-invalid-feedback>
        <b-form-invalid-feedback :state="passNotEqual">
          Les deux mot de passes ne sont pas égaux
        </b-form-invalid-feedback>
      </b-form-group>
    </b-form>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button @click="cancel" variant="danger">Annuler</b-button>
      <b-button @click="ok" variant="primary">Valider</b-button>
    </template>
  </b-modal>
</template>

<script lang="js" src="./AppProfil.js"></script>
