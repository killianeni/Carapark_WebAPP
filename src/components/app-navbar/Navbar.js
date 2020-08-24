import { mapGetters, mapState } from 'vuex';
import { AUTH_LOGOUT} from '../../store/actions/auth';

export default {
  name: 'Navbar',
  data: () => ({
    isBurgerActive: false
  }),
  methods: {
    toggle() {
      this.isBurgerActive = !this.isBurgerActive;
    },
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'));
    }
  },
  computed: {
    ...mapGetters(['userLogged', 'isAdmin', 'isAuthenticated', 'isUserLoaded']),
    ...mapState({
      authLoading: state => state.auth.status === 'loading',
      name: state => `${state.user.profile.title} ${state.user.profile.name}`
    })
  }
};

