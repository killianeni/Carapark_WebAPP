<template>
  <div>
    <b-card class="container">
      <img class="logo" src="../assets/img/kmap_logo.svg" alt="kmap_logo.svg" />
      <b-form>
        <b-form-group
          label="Nom"
          label-for="name"
          label-align="left"
        >
          <b-form-input
            id="name"
            v-model="form.name"
            required
          />
        </b-form-group>

        <b-form-group
          label="Prénom"
          label-for="firstname"
          label-align="left"
        >
          <b-form-input
            id="firstname"
            v-model="form.firstname"
            required
          />
        </b-form-group>

        <b-form-group
          label="Numéro de permis"
          label-for="license"
          label-align="left"
        >
          <b-form-input
            id="license"
            v-model="form.license"
          />
        </b-form-group>

        <b-form-group
          label="Identifiant"
          label-for="username"
          label-align="left"
        >
          <b-form-input
            id="username"
            v-model="form.username"
            required
          />
        </b-form-group>

        <b-form-group
          label="Mot de passe"
          label-for="password"
          label-align="left"
        >
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Au moins 6 caractères"
            required
          />
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          @click="hashMdp()"
        >
          Créer le compte
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
    export default {
        name: 'RegisterVue',
      data() {
        return {
          form: {
            name: '',
            firstname: '',
            license: '',
            username: '',
            password: ''
          }
        };
      },
    };
</script>

<style scoped>
  .logo {
    width: 120px;
  }

  .container{
    width: 400px;
  }
</style>
