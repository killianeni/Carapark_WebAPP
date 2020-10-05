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
          <b-button variant="primary" @click="openModalUpgrade">
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
            {{ item.role.libelle === 'user' ? 'Utilisateur' : 'Admin' }}
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
        <b-form-group
          label="Role"
          label-for="utilisateur-role"
          invalid-feedback=""
          v-if="isEdit"
        >
          <b-form-select
            id="utilisateur-role"
            v-model="form.role.id"
            value-field="id"
            text-field="modele_role">
            <b-form-select-option :value="null" disabled>-- Choix du role --</b-form-select-option>
            <b-form-select-option v-for="(role) in rolesAPI" v-bind:key="role.id" :value="role.id">
              {{ role.libelle }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
        <b-form-group v-if="isEdit">
          <b-form-checkbox
            value="true"
            v-model="form.resetPass"
          >
            Reset le mot de passe
          </b-form-checkbox>
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
            v-model="formUpgrade.roleId"
            value-field="id"
            text-field="modele_role">
            <b-form-select-option :value="null" disabled>-- Choix du role --</b-form-select-option>
            <b-form-select-option v-for="(role) in rolesAPI" v-bind:key="role.id" :value="role.id">
              {{ role.libelle }}
            </b-form-select-option>
          </b-form-select>
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
        id: '',
        nom: '',
        prenom: '',
        mail: '',
        permis: '',
        role: '',
        resetPass: false,
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
          key: 'role',
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
        roleId: ''
      },
      personnels: [],
      rolesAPI: [
        {
          id: "5280a0cb-71ed-4757-b1fd-f3f595dee92b",
          libelle: "Utilisateur"
        },
        {
          id: "a4828836-eff3-4151-b1b9-ab5d6a3cd3ca",
          libelle: "Administrateur"
        },
      ],
      idSite: this.$route.params.id,
      token: localStorage.getItem('user-token')
    }
  },
  mounted() {
    this.getUsersBySite();
  },
  computed: {
    ...mapGetters(['siteByCompany'])
  },
  methods: {
    async getUsersBySite() {
      await api.url(`/api/Utilisateurs/GetUtilisateursbySite/${this.idSite}`)
        .headers({"Authorization": "Bearer " + this.token})
        .get()
        .json()
        .then(data => {
          this.items = data;
          this.totalRows = data.length;
        });
    },
    async getPersonnelsBySite() {
      await api.url(`/api/Personnel/GetPersonnelsBySite/${this.idSite}`)
        .headers({"Authorization": "Bearer " + this.token})
        .get()
        .json()
        .then(data => {
          this.personnels = data;
          this.items.forEach((user) => {
            data.filter((d) => {
              if(user.id === d.id) {
                data.splice(data.indexOf(d), 1);
              }
            })
          });
        });
    },
    async postPersonnel() {

      const bodyPersonnel = {
        nom: this.form.nom,
        prenom: this.form.prenom,
        mail: this.form.mail,
        permis: this.form.permis,
        siteId: this.form.siteId
      };

      await api.url('/api/Personnel')
        .headers({
          "Authorization": "Bearer " + this.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        })
        .post(bodyPersonnel)
        .res(r => {
          if(r.ok === true) {
            const text = "Le personnel" + this.bodyPersonnel.nom + this.bodyPersonnel.prenom + "est créé";

            this.$parent.$refs.appToast.customToast('success',text);
            this.getPersonnelsBySite();
            this.$bvModal.hide('modal-personnel')
          }
        });
    },
    async upUsers(user) {
      await api.url('/api/Utilisateurs/UpUtilisateur')
        .headers({
          "Authorization": "Bearer " + this.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        })
        .post(user)
        .res(r => {
          if(r.ok === true) {
            this.$parent.$refs.appToast.successToast();
            this.getUsersBySite();
          }
        });
    },
    async putUtilisateurs() {

      const idUtilisateur = this.form.id;

      const bodyUtilisateur = {
        nom: this.form.nom,
        prenom: this.form.prenom,
        mail: this.form.mail,
        permis: this.form.permis,
        siteId: this.form.siteId
      };

      if(this.form.resetPass) {
        bodyUtilisateur.resetPass = true;
        bodyUtilisateur.password = sha512(this.form.mail.substring(0, this.form.mail.indexOf('@')));
      }

      await api.url(`/api/Utilisateurs/${idUtilisateur}`)
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .put(bodyUtilisateur)
        .badRequest(err => console.log(err))
        .res(r => {
          if(r.ok === true) {
            this.getUsersBySite();
            this.$parent.$refs.appToast.updateToast();
            this.$bvModal.hide('modal-personnel')
          }
        });
    },
    async deleteUtilisateur(idUtilisateur) {
      await api.url(`/api/Utilisateurs/${idUtilisateur}`)
        .headers({"Authorization": "Bearer " + this.token})
        .delete()
        .res(r => {
          if (r.ok === true) {
            this.$parent.$refs.appToast.deleteToast();
            this.getUsersBySite();
          }
        });
    },
    customLabel({nom, prenom}) {
      return `${nom} – ${prenom}`
    },
    okModalUser(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitModalUser();
    },
    async submitModalUser() {
      if(this.isEdit) {
        await this.putUtilisateurs();
      } else {
        await this.postPersonnel();
      }
    },
    resetModalUser() {
      this.titleModalPersonnel = 'Ajouter un personnel';
      this.form.id = '';
      this.form.nom = '';
      this.form.prenom = '';
      this.form.mail = '';
      this.form.permis = '';
      this.form.role = '';
      this.form.resetPass = false;
      this.isUser = false;
      this.isEdit = false;
    },
    editModalUser(item) {
      this.titleModalPersonnel = 'Modifier un utilisateur';
      this.isEdit = true;
      this.form.id = item.id;
      this.form.nom = item.nom;
      this.form.prenom = item.prenom;
      this.form.mail = item.mail;
      this.form.permis = item.permis;
      this.form.role = {id: item.role.id};
      this.$bvModal.show("modal-personnel");
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
          if (value)
          {
            this.deleteUtilisateur(item.id);
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    openModalUpgrade() {
      this.getPersonnelsBySite();
      this.$bvModal.show('modal-upgrade');
    },
    resetModalUpgrade() {
      this.formUpgrade.personnels = [];
      this.formUpgrade.roleId = '';
    },
    async okModalUpgrade(bvModalEvt) {
      bvModalEvt.preventDefault();
      await this.submitModalUpgrade();
    },
    async submitModalUpgrade() {
      const listPersonnels = this.formUpgrade.personnels;
      const roleId = this.formUpgrade.roleId;
      const users = [];

      listPersonnels.forEach(p => {
        let user = {
          "id": p.id,
          "role": {
            "id": roleId
          },
          "password": sha512(p.mail.substring(0, p.mail.indexOf('@')))
        };
        users.push(user);
      });

      await this.upUsers(JSON.stringify(users));
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

