export default {
  name: 'Navbar',
  data: () =>({
    isBurgerActive: false
  }),
  methods: {
    toggle() {
      this.isBurgerActive = !this.isBurgerActive
    }
  }
}
