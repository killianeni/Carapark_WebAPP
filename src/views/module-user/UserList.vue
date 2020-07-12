<template>
  <div class="user-list-page container-custom">
    <div class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-4 col-md-6 mt-3 mb-3">
          <router-link :to="{ name: 'UserPortal' }" class="btn btn-primary">
            <i class="kmap-icons icon-back mr-2"></i>
            Retour
          </router-link>
        </div>
        <div class="col-8 col-md-6 text-right mt-3 mb-3">
          <b-button variant="primary" v-b-modal.modal-user>
            <i class="kmap-icons icon-add mr-2"></i>
            Ajouter un utilisateur
          </b-button>
        </div>
      </div>
      <div class="table-user">
        <div class="container-fluid">
          <div class="container-fluid">
            <div class="row justify-content-between">
              <div class="col-12 col-md-4 mt-3 mb-3">
                <b-input-group>
                  <b-form-input
                    v-model="filterUser"
                    type="search"
                    id="filterInput"
                    placeholder="Rechercher"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" :disabled="!filterUser" @click="filterUser = ''">Effacer</b-button>
                  </b-input-group-append>
                </b-input-group>
              </div>
              <div class="col-12 col-md-4 mt-3 mb-3">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  size="md"
                  class="my-0 justify-content-end"
                ></b-pagination>
              </div>
            </div>
          </div>
        </div>
        <b-table
          striped
          hover
          :items="items"
          :fields="fields"
          stacked="md"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filterUser">
          <template v-slot:cell(actions)="{item}">
            <b-button-group>
              <b-button variant="primary" @click="editeUser(item)">
                <i class="kmap-icons icon-edit"></i>
              </b-button>
              <b-button variant="danger" @click="deleteUser(item)">
                <i class="kmap-icons icon-delete"></i>
              </b-button>
            </b-button-group>
          </template>
          <template v-slot:cell(actif)="{item}">
            <i v-if="item.actif" class="kmap-icons icon-true color-true"></i>
            <i v-else class="kmap-icons icon-false color-false"></i>
          </template>
        </b-table>
        <div class="container-fluid d-md-none">
          <div class="row justify-content-end">
            <div class="col-12 col-md-4 mt-3 mb-3">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                size="md"
                class="my-0 justify-content-end"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      id="modal-user"
      ref="modal"
      title="Ajouter un utilisateur"
      cancel-title="Annuler"
      ok-title="Valider"
      cancel-variant="danger"
      ok-variant="primary"
      header-bg-variant="light"
      body-bg-variant="light"
      footer-bg-variant="light"
      @hidden="resetModalUser"
      @ok="okUser"
      centered
    >
      <form ref="form" @submit.stop.prevent="submitUser">
        <b-form-group
          label="Nom"
          label-for="user-nom"
          invalid-feedback=""
        >
          <b-form-input
            id="user-nom"
            v-model="form.nom"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Prénom"
          label-for="user-prenom"
          invalid-feedback=""
        >
          <b-form-input
            id="user-prenom"
            v-model="form.prenom"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Mail"
          label-for="user-mail"
          invalid-feedback=""
        >
          <b-form-input
            id="user-mail"
            v-model="form.mail"
            type="email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Permis"
          label-for="user-permis"
          invalid-feedback=""
        >
          <b-form-input
            id="user-mail"
            v-model="form.permis"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            value="true"
            v-model="form.actif"
          >
            Actif
          </b-form-checkbox>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'UserList',
    data() {
      return {
        form: {
          nom: '',
          prenom: '',
          mail: '',
          permis: '',
          actif: '',
          site: this.$route.params.id
        },
        fields: [
          {
            key: 'nom',
            label: 'Nom',
            sortable: true,
          },
          {
            key: 'prenom',
            label: 'Prénom',
            sortable: true,
          },
          {
            key: 'mail',
            label: 'Mail',
            sortable: true,
          },
          {
            key: 'permis',
            label: 'Permis',
            sortable: true,
          },
          {
            key: 'actif',
            label: 'Actif',
            sortable: true,
          },
          {
            key: 'actions',
            label: 'Actions'
          },
        ],
        items: [
          {id: 1, nom: 'Toto', prenom: 'Michel', mail: 'toto.micheh@eni.fr', permis: 'B', actif: true},
          {id: 2, nom: 'Tata', prenom: 'Thomas', mail: 'tata.thomas@eni.fr', permis: 'B', actif: true},
          {id: 3, nom: 'Titi', prenom: 'Antoine', mail: 'titi.antoine@eni.fr', permis: 'B', actif: false},
          {id: 4, nom: 'Tete', prenom: 'Richard', mail: 'tete.richard@eni.fr', permis: 'B', actif: false},
          {id: 5, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 6, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 7, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 8, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 9, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 10, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 11, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 12, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 13, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 14, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
          {id: 15, nom: 'Taztaz', prenom: 'Adrien', mail: 'taztaz.adrien@eni.fr', permis: 'B', actif: true},
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        filterUser: null,
      }
    },
    mounted() {
      this.totalRows = this.items.length
    },
    methods: {
      okUser(bvModalEvt) {
        bvModalEvt.preventDefault();
        this.submitUser()
      },
      submitUser() {
        console.log(JSON.stringify(this.form));
        this.$nextTick(() => {
          this.$bvModal.hide('modal-user')
        })
      },
      resetModalUser() {
        this.form.nom = '';
        this.form.prenom = '';
        this.form.mail = '';
        this.form.permis = '';
        this.form.actif = null
      },
      editeUser(item) {
        this.$bvModal.show("modal-user");
        this.form.nom = item.nom;
        this.form.prenom = item.prenom;
        this.form.mail = item.mail;
        this.form.permis = item.permis;
        this.form.actif = item.actif;
        console.log(item);
      },
      deleteUser(item) {
        this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez supprimer cette utilisateur.', {
          title: 'Veuillez confirmer',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'primary',
          cancelVariant: 'danger',
          okTitle: 'Valider',
          cancelTitle: 'Annuler',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            console.log(value);
            console.log(item);
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
  };
</script>

<style scoped lang="scss">

</style>

