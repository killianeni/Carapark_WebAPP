<template>
  <div>
    <div v-if="isAuthenticated">
      <Navbar/>
      <div class="dashboard-page container-custom">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              1 of 2
            </div>
            <div class="col">
              2 of 2
            </div>
          </div>
          <div class="row">
            <div class="col">
              1 of 3
            </div>
            <div class="col">
              2 of 3
            </div>
            <div class="col">
              3 of 3
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
  import Navbar from '@/components/app-navbar/Navbar.vue';
  import {mapGetters} from 'vuex';
  import Login from './Login';

  export default {
    name: 'Dashboard',
    components: {
      Navbar,
      Login
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'authStatus'])
    },
  };
</script>
