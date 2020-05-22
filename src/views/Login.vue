<template>
  <div>
    <b-card class="container">
      <img class="logo" src="../assets/img/kmap_logo.svg" alt="kmap_logo.svg" />
      <b-form>
        <b-form-group
          label="Identifiant"
          label-for="username"
          label-align="left"
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
          label-align="left"
        >
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Veuillez entrer votre mot de passe"
          />
        </b-form-group>

        <p class="forgot-password">
          <router-link to="/">
            Mot de passe oublié ?
          </router-link>
        </p>

        <b-button
          type="submit"
          variant="primary"
          @click="hashMdp()"
        >
          Connexion
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
  import bcrypt from 'bcryptjs';

  export default {
    name: 'LoginVue',
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      async hashMdp() {
        await bcrypt.hash(this.form.password, 8, function(err, hash) {
          // store password in db
          console.log(hash);
        });
      }
    }
  };
</script>

<style scoped>
  .logo {
    width: 120px;
  }

  .container{
    margin-top: 10px;
    width: 400px;
  }

  .forgot-password{
    text-align: left;
  }
</style>
