import {api} from '@/config';

export default {
  name: 'AppSite',
  props: {
    typePage: String
  },
  data() {
    return {
      dataSites: [],
      form: {
        libelle: ''
      },
    }
  },
  methods: {
    okSite(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.submitSite()
    },
    submitSite() {
      console.log(JSON.stringify(this.form));
      this.$nextTick(() => {
        this.$bvModal.hide('modal-site')
      })
    },
    resetModal() {
      this.form.libelle = ''
    },
    editSite(item) {
      this.$bvModal.show("modal-site");
      this.form.libelle = item.libelle;
      console.log(item);
    },
    deleteSite(item) {
      this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez supprimer ce site et toutes les voitures associées.', {
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
    async getSiteByEntreprise() {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('user-token');
      const idEntreprise = user.idEntreprise;
      this.dataSites = await api.url(`/api/Sites/GetSitebyEntreprise/${idEntreprise}/utilisateur`)
        .headers({"Authorization": "Bearer " + token})
        .get()
        .json();
    },
  },
  mounted() {
    this.getSiteByEntreprise()
  }
}
