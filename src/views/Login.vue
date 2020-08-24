<template>
  <div class="login-page">
    <b-card>
      <div class="container-logo">
        <img class="logo img-fluid" src="../assets/img/kmap_logo.svg" alt="kmap_logo.svg"/>
      </div>
      <b-form>
        <b-form-group
          label="Identifiant"
          label-for="username"
          label-align="left"
        >
          <b-form-input
            id="username"
            v-model="username"
            required
            placeholder="Identifiant"
          />
        </b-form-group>

        <b-form-group
          label="Mot de passe"
          label-for="password"
          label-align="left"
        >
          <b-form-input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Mot de passe"
          />
        </b-form-group>

        <div class="forgot-password">
          <router-link to="/">
            Mot de passe oublié ?
          </router-link>
        </div>

        <div class="container-submit">
          <b-button
            class="submit"
            type="submit"
            variant="primary"
            @click="hashMdp()"
          >
            Connexion
          </b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
  // import bcrypt from 'bcryptjs';
  import {AUTH_REQUEST} from '../store/actions/auth';

  export default {
    name: 'LoginVue',
    data() {
      return {
        username: 'jean.bon@eni.fr',
        password: '123456'
      };
    },
    methods: {
      async hashMdp() {
        // await bcrypt.hash(this.password, 8, function(err, hash) {
        //   // store password in db
        //   console.log(hash);
        // });
        const {username, password} = this;
        await this.$store.dispatch(AUTH_REQUEST, {username, password}).then(() => {
          this.$router.push({ name: 'Dashboard' });
        });
      }
    }
  };
</script>

<style scoped lang="scss">

  .login-page {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .card {
      width: 400px;
      background-color: $colorGrey;
      font-weight: bold;

      .card-body {
        padding: 30px;

        .container-logo {
          width: 150px;
          margin: 0 auto;
        }

        input {
          height: 50px;
        }

        .container-submit {
          text-align: center;
          margin: 15px 0;

          .submit {
            width: 200px;
            border-radius: 20px;
          }
        }
      }
    }
  }

</style>
