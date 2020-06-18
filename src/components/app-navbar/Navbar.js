export default {
  name: 'Navbar',
  data: () => ({
    isBurgerActive: false
  }),
  methods: {
    toggle() {
      this.isBurgerActive = !this.isBurgerActive;
    }
  },
  computed: {
    hide() {
      if (this.$route.path === '/login' || this.$route.path === '/register') {
        return false;
      }
      return true;
    }
  }
};

