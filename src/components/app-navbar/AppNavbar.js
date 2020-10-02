import moment from 'moment';
import {mapGetters} from 'vuex';
import {AUTH_LOGOUT} from '../../store/actions/auth';
import {api} from "@/config";

export default {
  name: 'AppNavbar',
  data: () => ({
    token: '',
    isBurgerActive: false,
    notifications: [],
    countNotification: 0,
    libelleSite: ''
  }),
  methods: {
    toggle() {
      this.isBurgerActive = !this.isBurgerActive;
    },
    logout: function () {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'));
    },
    profil() {
      this.$parent.$refs.appProfil.initCurrentUser();
    },
    messageVariant(typeNotif) {
      let variant = '';
      switch (typeNotif) {
        case 1:
          variant = 'info';
          break;
        case 2:
          variant = 'success';
          break;
        case 3:
          variant = 'danger';
          break;
        case 4:
          variant = 'dark';
          break;
      }
      return variant;
    },
    messageNotif(notification) {
      const typeNotif = notification.typeNotif;
      const dateResa = moment(notification.dateResa).format('DD/MM/YYYY');
      let message = '';

      switch (typeNotif) {
        case 1:
          message = 'Un commentaire a été ajouté à votre réservation du ' + dateResa;
          break;
        case 2:
          message = 'Réservation du ' + dateResa + ' est acceptée';
          break;
        case 3:
          message = 'Réservation du ' + dateResa + ' est refusée';
          break;
        case 4:
          message = 'Réservation du ' + dateResa + ' est clôturée';
          break;
      }
      return message;
    },
    getThisReservation(notification) {
      const routeName = this.$route.name;
      if (routeName !== 'ReserveListUser') {
        this.$router.push({name: 'ReserveListUser'}).then(() => {
          this.openNotification(notification);
        });
      } else {
        this.openNotification(notification);
      }
    },
    openNotification(notification) {
      this.updateNotification(notification.id);
      this.$parent.$children[3].filterReservation = notification.idResa;
      this.$parent.$children[3].$refs.formReservationAction.infoModalNotification(notification, 'notif');
    },
    async getNotificationsByUser() {
      this.token = localStorage.getItem('user-token');
      const userId = this.userLogged.id;

      await api.url(`/api/Notifications/GetNotificationsByUser/${userId}`)
        .headers({'Authorization': 'Bearer ' + this.token})
        .get()
        .json()
        .then(data => {
          this.notifications = [];
          this.countNotification = 0;
          data.forEach((d) => {
            this.notifications.push(d);
            if (d.checked === false) {
              this.countNotification += 1;
            }
          });
        });
    },
    async updateNotification(idNotif) {
      const bodyNotification = {
        'checked': true
      };
      await api.url(`/api/Notifications/CheckNotif/${idNotif}`)
        .headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
        .put(bodyNotification)
        .badRequest(err => console.log(err))
        .res(r => {
          if (r.ok) {
            this.getNotificationsByUser();
          }
        });
    },
    async getCurrentLibelleSite() {
      const currentRoute = this.$route.name;

      if (currentRoute === 'ParkCar'
        || currentRoute === 'UserList'
        || currentRoute === 'ReserveListSite'
      ) {
        const idSite = this.$route.params.id;
        await api.url(`/api/Sites/${idSite}`)
          .headers({"Authorization": "Bearer " + this.token})
          .get()
          .json()
          .then(data => {
            this.libelleSite = data.libelle;
          });
      } else {
        this.libelleSite= '';
      }
    },
  },
  computed: {
    ...mapGetters(['userLogged', 'isAdmin', 'isAuthenticated']),
    countNotificationValue() {
      return this.countNotification > 0 ? this.countNotification.toString() : null;
    }
  },
  mounted() {
    if (this.isAuthenticated) {
      this.getNotificationsByUser();
      this.getCurrentLibelleSite();
    }
  },
  created() {
    this.interval = setInterval(function () {
      if (this.isAuthenticated) {
        this.getNotificationsByUser();
      }
    }.bind(this), 10000);
  },
  watch: {
    $route (){
      this.getCurrentLibelleSite();
    }
  }
};

