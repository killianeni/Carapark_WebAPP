<template>
  <div>
    <div v-if="isAuthenticated">
      <div class="dashboard-page container-custom">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              Calendrier
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isAuthenticated">
      <login />
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Login from './Login';

  export default {
    name: 'Dashboard',
    components: {
      Login
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'authStatus'])
    },
  };
</script>
