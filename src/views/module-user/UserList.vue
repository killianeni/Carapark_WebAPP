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
          <b-button variant="primary" class="mr-3" v-b-modal.modal-personnel>
            <i class="kmap-icons icon-add mr-2"></i>
            Ajouter
          </b-button>
          <b-button variant="primary" v-b-modal.modal-upgrade>
            <i class="kmap-icons icon-add mr-2"></i>
            Mise à niveau
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
              <b-button variant="primary" @click="editModalUser(item)">
                <i class="kmap-icons icon-edit"></i>
              </b-button>
              <b-button variant="danger" @click="deleteModalUser(item)">
                <i class="kmap-icons icon-delete"></i>
              </b-button>
            </b-button-group>
          </template>
          <template v-slot:cell(role)="{item}">
            {{ item.nomRole }}
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
      id="modal-personnel"
      ref="modal"
      :title="titleModalPersonnel"
      cancel-title="Annuler"
      ok-title="Valider"
      cancel-variant="danger"
      ok-variant="primary"
      header-bg-variant="light"
      body-bg-variant="light"
      footer-bg-variant="light"
      @hidden="resetModalUser"
      @ok="okModalUser"
      centered
    >
      <form ref="form" @submit.stop.prevent="submitModalUser">
        <b-form-group
          label="Nom"
          label-for="personnel-nom"
          invalid-feedback=""
        >
          <b-form-input
            id="personnel-nom"
            v-model="form.nom"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Prénom"
          label-for="personnel-prenom"
          invalid-feedback=""
        >
          <b-form-input
            id="personnel-prenom"
            v-model="form.prenom"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Mail"
          label-for="personnel-mail"
          invalid-feedback=""
        >
          <b-form-input
            id="personnel-mail"
            v-model="form.mail"
            type="email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Permis"
          label-for="personnel-permis"
          invalid-feedback=""
        >
          <b-form-input
            id="personnel-permis"
            v-model="form.permis"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      id="modal-upgrade"
      ref="modal"
      title="Mise à niveau des personnels"
      cancel-title="Annuler"
      ok-title="Valider"
      cancel-variant="danger"
      ok-variant="primary"
      header-bg-variant="light"
      body-bg-variant="light"
      footer-bg-variant="light"
      @hidden="resetModalUpgrade"
      @ok="okModalUpgrade"
      centered
    >
      <form
        ref="form"
        class="form-upgrade"
        submit.stop.prevent="submitModalUpgrade">
        <b-form-group
          label="Liste des personnels"
          label-for="upgrade-personnel"
          invalid-feedback=""
        >
          <multiselect
            id="upgrade-personnel"
            v-model="formUpgrade.personnels"
            placeholder="Rechercher un personnel"
            label="name"
            track-by="nom"
            deselectLabel="Supprimer"
            selectLabel="Sélectionner"
            selectedLabel="Sélectionné"
            :options="personnels"
            :multiple="true"
            :custom-label="customLabel"
            :optionsLimit=10
          >
            <template slot="option" slot-scope="props">
              <div class="option-list-personnel">
                <b-avatar variant="primary"></b-avatar>
                <div class="nom-prenom">{{ props.option.nom }} {{ props.option.prenom }}</div>
              </div>
            </template>
            <span slot="noResult">Aucun personnel trouvé</span>
          </multiselect>
        </b-form-group>
        <b-form-group
          label="Role"
          label-for="role">
          <b-form-select
            id="role"
            v-model="formUpgrade.role"
            :options="roles"
            required
          ></b-form-select>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import {mapGetters} from "vuex";
import {api} from '@/config';
import sha512 from 'js-sha512';

export default {
  name: 'UserList',
  components: {
    Multiselect
  },
  data() {
    return {
      titleModalPersonnel: 'Ajouter un personnel',
      isUser: false,
      isEdit: false,
      form: {
        nom: '',
        prenom: '',
        mail: '',
        permis: '',
        role: '',
        siteId: this.$route.params.id
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
          key: 'role.libelle',
          label: 'Role',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Actions'
        },
      ],
      items: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filterUser: null,
      formUpgrade: {
        personnels: [],
        role: []
      },
      personnels: [],
      roles: [
        {text: 'Utilisateur', value: 'user'},
        {text: 'Admin', value: 'admin'},
      ],
      rolesAPI: [
        {
          id: "5280a0cb-71ed-4757-b1fd-f3f595dee92b",
          libelle: "user"
        },
        {
          id: "a4828836-eff3-4151-b1b9-ab5d6a3cd3ca",
          libelle: "admin"
        },
        {
          id: "4a3b872b-ae9f-4b04-89ca-ddbb26e2dc25",
          libelle: "super-admin"
        }
      ],
      idSite: this.$route.params.id,
      token: localStorage.getItem('user-token')
    }
  },
  mounted() {
    this.getUsers();
    this.getPersonnels();
    this.totalRows = this.items.length;
  },
  computed: {
    ...mapGetters(['siteByCompany'])
  },
  methods: {
    async getUsers() {
      this.items = await api.url(`/api/Utilisateurs/GetUtilisateursbySite/${this.idSite}`)
        .headers({"Authorization": "Bearer " + this.token})
        .get()
        .json();
    },
    async getPersonnels() {
      this.personnels = await api.url(`/api/Personnel/GetPersonnelsBySite/${this.idSite}`)
        .headers({"Authorization": "Bearer " + this.token})
        .get()
        .json();
    },
    async postPersonnel(personnel) {
      await api.url('/api/Personnel')
        .headers({
          "Authorization": "Bearer " + this.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        })
        .post(personnel);
      await this.getPersonnels();
    },
    async upUsers(user) {
      await api.url('/api/Utilisateurs/UpUtilisateur')
        .headers({
          "Authorization": "Bearer " + this.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        })
        .post(user);
      await this.getUsers();
    },
    customLabel({nom, prenom}) {
      return `${nom} – ${prenom}`
    },
    okModalUser(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalUser();
    },
    async submitModalUser() {
      await this.postPersonnel(JSON.stringify(this.form));
      await this.getPersonnels();
      this.$nextTick(() => {
        this.$bvModal.hide('modal-personnel')
      })
    },
    resetModalUser() {
      this.titleModalPersonnel = 'Ajouter un personnel';
      this.form.nom = '';
      this.form.prenom = '';
      this.form.mail = '';
      this.form.permis = '';
      this.form.role = '';
      this.isUser = false;
      this.isEdit = false;
    },
    editModalUser(item) {
      this.titleModalPersonnel = 'Modifier un utilisateur';
      this.isEdit = true;
      this.$bvModal.show("modal-personnel");
      this.form.nom = item.nom;
      this.form.prenom = item.prenom;
      this.form.mail = item.mail;
      this.form.permis = item.permis;
      this.form.role = item.role.libelle;
      console.log(item);
    },
    deleteModalUser(item) {
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
    },
    resetModalUpgrade() {
      this.formUpgrade.personnels = [];
      this.formUpgrade.role = [];
    },
    async okModalUpgrade(bvModalEvt) {
      bvModalEvt.preventDefault();
      await this.submitModalUpgrade();
    },
    async submitModalUpgrade() {
      let mail = this.formUpgrade.personnels[0].mail;
      let role = this.rolesAPI.find(role => role.libelle === this.formUpgrade.role);
      let user = {
        role: {id: role.id},
        id: this.formUpgrade.personnels[0].id,
        password: sha512(mail.substring(0, mail.indexOf('@')))
      };
      await this.upUsers(JSON.stringify(user));
      await this.getUsers();
      this.$nextTick(() => {
        this.$bvModal.hide('modal-upgrade');
      })
    },
  }
};
</script>

<style scoped lang="scss">
#modal-upgrade {
  .form-upgrade {
    .option-list-personnel {
      display: flex;
      align-items: center;

      .nom-prenom {
        padding-left: 10px;
      }
    }
  }
}
</style>

