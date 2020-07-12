<template>
  <header class="header">
    <div class="menu-header">
      <div class="container-navbar-toggle">
        <button class="navbar-toggler"
                @click.prevent="toggle"
                type="button"
                aria-label="Toggle navigation">
          <div id="nav-toggler-icon">
            <span class="nav-icon"></span>
            <span class="nav-icon"></span>
            <span class="nav-icon"></span>
            <span class="nav-icon"></span>
          </div>
        </button>
        <div class="current-title-page">
          <span v-if="$route.name === 'ParkCar'">{{ $route.meta.title }} LIBELLE</span>
          <span v-else-if="$route.name === 'UserList'">{{ $route.meta.title }} LIBELLE SITE</span>
          <span v-else>{{ $route.meta.title }}</span>
        </div>
      </div>
      <div v-if="isAuthenticated" class="profil">
        <b-dropdown class="dropdown-avatar" variant="none" no-caret>
          <template v-slot:button-content>
            <div class="container-avatar">
              <i class="kmap-icons icon-avatar avatar"></i>
            </div>
          </template>
          <b-dropdown-item href="#">Profil</b-dropdown-item>
          <b-dropdown-item @click="logout">Déconnexion</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="menu-navigation-container" :class="{ 'open' : isBurgerActive }">
      <div class="menu-navigation">
        <img src="~@/assets/img/kmap_logo.svg" alt="" class="logo">
        <nav class="nav-module">
          <ul v-if="isAuthenticated">
            <li>
              <router-link to="/" class="nav-module-item"
                           v-bind:class="[$route.name === 'Dashboard' ? 'active' : '']">
                <i class="kmap-icons icon-dashboard nav-module-item-icon"></i>
                <span class="nav-module-item-name">Tableau de bord</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'ReserveListUser' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'ReserveListUser' ? 'active' : '']">
                <i class="kmap-icons icon-my-reservation nav-module-item-icon"></i>
                <span class="nav-module-item-name">Mes Réservations</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'ParkPortal' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'ParkPortal' || $route.name === 'ParkCar' ? 'active' : '']">
                <i class="kmap-icons icon-car-park nav-module-item-icon"></i>
                <span class="nav-module-item-name">Parc</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'ReservePortal' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'ReservePortal' || $route.name === 'ReserveSite' ? 'active' : '']">
                <i class="kmap-icons icon-reservation nav-module-item-icon"></i>
                <span class="nav-module-item-name">Réservation</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'UserPortal' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'UserPortal' || $route.name === 'UserList' ? 'active' : '']">
                <i class="kmap-icons icon-users nav-module-item-icon"></i>
                <span class="nav-module-item-name">Utilisateurs</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="menu-navigation-shadow" @click.prevent="toggle"></div>
    </div>
  </header>
</template>

<script lang="js" src="./Navbar.js"></script>
<style lang="scss" src="./Navbar.scss" rel="stylesheet"></style>
