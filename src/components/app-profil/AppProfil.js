import { mapGetters } from 'vuex';
import sha512 from  'js-sha512';
import {api} from "@/config";

export default {
  name: "AppProfil",
  data() {
    return {
      form: {
        id : '',
        nom: '',
        prenom: '',
        mail: '',
        oldPass: '',
        newPass: '',
        confirmPass: '',
      },
      token: localStorage.getItem('user-token'),
      emptyPassError: {
        oldPass: null,
        newPass: null,
        confirmPass: null,
      },
      passNotEqual: null
    };
  },
  methods: {
    initCurrentUser() {
      this.form.id = this.userLogged.id;
      this.form.nom = this.userLogged.nom;
      this.form.prenom = this.userLogged.prenom;
      this.form.mail = this.userLogged.mail;
      this.$bvModal.show("modal-profil");
    },
    resetModalProfil() {
      this.form.nom = '';
      this.form.prenom = '';
      this.form.mail = '';
      this.form.oldPass = '';
      this.form.newPass = '';
      this.form.confirmPass = '';
    },
    okModalProfil(bvModalEvt) {
      bvModalEvt.preventDefault();

      this.form.oldPass === '' ? this.emptyPassError.oldPass = false : this.emptyPassError.oldPass = true;
      this.form.newPass === '' ? this.emptyPassError.newPass = false : this.emptyPassError.newPass = true;
      this.form.confirmPass === '' ? this.emptyPassError.confirmPass = false : this.emptyPassError.confirmPass = true;

      if (this.emptyPassError.oldPass && this.emptyPassError.newPass && this.emptyPassError.confirmPass) {
        this.submitPassword();
      }
    },
    submitPassword() {
      this.form.newPass === this.form.confirmPass ? this.passNotEqual = true : this.passNotEqual = false;

      if(this.passNotEqual) {

        const bodyPass = {
          idUser: this.form.id,
          oldPass: sha512(this.form.oldPass),
          newPass: sha512(this.form.newPass),
        };

        this.updatePass(bodyPass);
      }
    },
    async updatePass(bodyPass) {
      await api.url(`/api/Utilisateurs/Password/${bodyPass.idUser}/${bodyPass.oldPass}/${bodyPass.newPass}`)
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .put()
        .badRequest(err => console.log(err.status))
        .error(401, err => {
          const text = "Code " + err.status + " : authentification invalide";
          this.$parent.$refs.appToast.customToast('danger',text);
          this.$bvModal.hide("modal-profil");
        })
        .res(r => {
          if (r.ok === true) {
            this.$parent.$refs.appToast.updateToast();
            this.$bvModal.hide("modal-profil");
          }
        })
    },
  },
  computed: {
    ...mapGetters(['userLogged']),
  },
}
