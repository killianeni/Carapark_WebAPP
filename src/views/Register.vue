<template>
  <div class="register-page">
    <b-card>
      <div class="container-logo">
        <img class="logo" src="../assets/img/kmap_logo.svg" alt="kmap_logo.svg"/>
      </div>
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

        <div class="container-submit">
          <b-button
            class="submit"
            type="submit"
            variant="primary"
            @click="hashMdp()"
          >
            Créer le compte
          </b-button>
        </div>
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

<style scoped lang="scss">
  .register-page {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

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
