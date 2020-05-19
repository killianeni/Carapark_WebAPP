<template>
  <div>
    <b-form>
      <b-form-group
        label="Identifiant"
        label-for="username"
      >
        <b-form-input
          id="username"
          v-model="form.username"
          required
          placeholder="Veuillez entrer votre identifiant"
        />
      </b-form-group>

      <b-form-group
        label="Mot de passe"
        label-for="password"
      >
        <b-form-input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="Veuillez entrer votre mot de passe"
        />
      </b-form-group>

      <b-button type="submit" variant="primary">Connexion</b-button>
      <p class="forgot-password">
        <router-link to="/">Mot de passe oublié  ?</router-link>
      </p>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: 'LoginVue',
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    }
  }
</script>

<style scoped>
  .form-control{
    margin: auto;
    width: 50%;
  }
</style>
