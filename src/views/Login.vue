<template>
  <div class="login-page">
    <b-card>
      <div class="container-logo">
        <img class="logo img-fluid" src="../assets/img/caraPark_logo.svg" alt="kmap_logo.svg" />
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
  import {AUTH_REQUEST} from '../store/actions/auth';
  import sha512 from  'js-sha512';

  export default {
    name: 'LoginVue',
    data() {
      return {
        username: '',
        password: '',
        hashPassword: ''
      };
    },
    methods: {
      async hashMdp() {
        this.hashPassword = sha512(this.password);
        const {username, hashPassword} = this;

        await this.$store.dispatch(AUTH_REQUEST, {username, hashPassword})
          .then(() => {
            this.$parent.$children[0].getNotificationsByUser();
            this.$router.push({ name: 'Dashboard' });
            this.$parent.$refs.appToast.customToast('success','Connexion réussie');
          })
          .catch(error => {
            const text = 'Code ' + error.status + ' : Identifiant ou mot de passe incorrect';
            this.$parent.$refs.appToast.customToast('danger',text);
          })
        ;
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
