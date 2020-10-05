export default {
  name: 'AppToast',
  data: () => ({
    toast: {
      variant: '',
      text: ''
    }
  }),
  methods: {
    successToast() {
      this.toast.variant = 'success';
      this.toast.text = 'La création est bien réalisée';
      this.$bvToast.show('app-toast');
    },
    updateToast() {
      this.toast.variant = 'warning';
      this.toast.text = 'La mise à jour est bien réalisée';
      this.$bvToast.show('app-toast');
    },
    deleteToast() {
      this.toast.variant = 'info';
      this.toast.text = 'La suppression est bien réalisée';
      this.$bvToast.show('app-toast');
    },
    errorToast() {
      this.toast.variant = 'danger';
      this.toast.text = 'Une erreur est rencontrée';
      this.$bvToast.show('app-toast');
    },
    customToast(variant,text) {
      this.toast.variant = variant;
      this.toast.text = text;
      this.$bvToast.show('app-toast');
    },
   }
}
