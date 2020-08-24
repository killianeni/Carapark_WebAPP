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
        <b-dropdown
          class="dropdown-custom dropdown-alert"
          variant="none"
          menu-class="m-0"
          no-caret
        >
          <template slot="button-content">
            <b-avatar variant="dark" badge-variant="danger" badge="7">
              <template slot="default">
                <span class="kmap-icons icon-cloche"></span>
              </template>
            </b-avatar>
          </template>
          <b-list-group>
            <b-list-group-item href="#" variant="success">Réservation du 24/08/2020 est acceptée</b-list-group-item>
            <b-list-group-item href="#" variant="success">Réservation du 25/08/2020 est acceptée</b-list-group-item>
            <b-list-group-item href="#" variant="danger">Réservation du 26/08/2020 est refusée</b-list-group-item>
            <b-list-group-item href="#" variant="warning">Un commentaire a été ajouté à votre réservation du 27/08/2020</b-list-group-item>
          </b-list-group>
        </b-dropdown>
        <b-dropdown
          class="dropdown-custom dropdown-avatar"
          variant="none"
          menu-class="m-0"
          no-caret
        >
          <template slot="button-content">
            <b-avatar variant="dark"></b-avatar>
          </template>
          <div class="text-center">
            <b-avatar class="mt-3 mb-3" variant="primary" size="5rem"></b-avatar>
            <div class="nom-prenom">
              <span>{{ name }}</span>
            </div>
            <div class="mail">
              <span>{{ mail }}</span>
            </div>
            <div class="deco m-3">
              <b-button variant="primary" @click="logout">Déconnexion</b-button>
            </div>
          </div>
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
                           v-bind:class="[$route.name === 'ReservePortal' || $route.name === 'ReserveListSite' ? 'active' : '']">
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
