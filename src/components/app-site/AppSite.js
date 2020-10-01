import {api} from '@/config';
import {mapGetters} from "vuex";

export default {
  name: 'AppSite',
  props: {
    typePage: String
  },
  data() {
    return {
      token: localStorage.getItem('user-token'),
      titleSiteModal: '',
      dataSites: [],
      formSite: {
        idSite: '',
        isEdit: false,
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
      if(this.formSite.isEdit)
      {
        // edit
        const bodySite = {
          libelle: this.formSite.libelle
        };
        this.updateSite(this.formSite.idSite, bodySite);

      }else {
        //add
        const bodySite = {
          libelle: this.formSite.libelle,
          entreprise: {
            id: this.userLogged.idEntreprise
          }
        };

        this.addNewSite(bodySite);
      }
    },
    resetModal() {
      this.formSite.idSite = '';
      this.formSite.isEdit = false;
      this.formSite.libelle = '';
      this.titleSiteModal = '';
    },
    addSiteModal()
    {
      this.titleSiteModal = 'Ajouter un site';
      this.$bvModal.show("modal-site");
    },
    editSiteModal(item) {
      this.formSite.idSite = item.id;
      this.formSite.isEdit = true;
      this.formSite.libelle = item.libelle;
      this.titleSiteModal = 'Modifier le site';
      this.$bvModal.show("modal-site");
    },
    deleteSiteModal(item) {
      this.$bvModal.msgBoxConfirm('Veuillez confirmer que vous souhaitez supprimer ce site.', {
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
          if(value){
            this.deleteSite(item.id);
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    checkCanDelete(dataSite) {
      const total = dataSite.nbVehicules + dataSite.nbUtilisateurs + dataSite.nbReservations;
      if (total > 0)
        return true;
      return false;
    },
    async getSiteByEntreprise() {
      const user = this.userLogged;
      const idEntreprise = user.idEntreprise;
      const pageCourante = this.$route.name;
      switch (pageCourante) {
        case 'ParkPortal':
          this.dataSites = await api.url(`/api/Sites/GetSitesbyEntreprise/${idEntreprise}/all`)
            .headers({"Authorization": "Bearer " + this.token})
            .get()
            .json();
          break;
        case 'ReservePortal': {
          this.dataSites = await api.url(`/api/Sites/GetSitesbyEntreprise/${idEntreprise}/reservation`)
            .headers({"Authorization": "Bearer " + this.token})
            .get()
            .json();
          break;
        }
        case 'UserPortal':
          this.dataSites = await api.url(`/api/Sites/GetSitesbyEntreprise/${idEntreprise}/utilisateur`)
            .headers({"Authorization": "Bearer " + this.token})
            .get()
            .json();
          break;
      }
    },
    async addNewSite(bodySite) {
      await api.url('/api/Sites')
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .post(bodySite)
        .badRequest(err => console.log(err))
        .res(r => {
          if(r.ok === true) {
            this.$parent.$parent.$refs.appToast.successToast();
            this.$bvModal.hide("modal-site");
            this.dataSites = [];
            this.getSiteByEntreprise();
          }
        });
    },
    async updateSite(idSite, bodySite) {
      await api.url(`/api/Sites/${idSite}`)
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .put(bodySite)
        .badRequest(err => console.log(err))
        .res(r => {
          if (r.ok === true) {
            this.$parent.$parent.$refs.appToast.updateToast();
            this.$bvModal.hide("modal-site");
            this.dataSites = [];
            this.getSiteByEntreprise();
          }
        });
    },
    async deleteSite(idSite) {
      await api.url(`/api/Sites/${idSite}`)
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .delete()
        .badRequest(err => console.log(err))
        .res(r => {
          if (r.ok === true) {
            this.$parent.$parent.$refs.appToast.updateToast();
            this.$bvModal.hide("modal-site");
            this.dataSites = [];
            this.getSiteByEntreprise();
          }
        });
    },
  },
  computed: {
    ...mapGetters(['userLogged']),
  },
  mounted() {
    this.getSiteByEntreprise()
  }
}
