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
          <span>{{ $route.meta.title }} {{ libelleSite }}</span>
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
            <b-avatar
              variant="dark"
              badge-variant="danger"
              :badge="countNotificationValue">
              <template slot="default">
                <span class="kmap-icons icon-cloche"
                      v-bind:class="{ clocheAnimation: countNotification > 0}"></span>
              </template>
            </b-avatar>
          </template>
          <b-list-group class="notif-scroll">
            <template v-for="(notification) in notifications">
                <b-list-group-item
                  button
                  :variant="messageVariant(notification.typeNotif)"
                  v-bind:key="notification.id"
                  v-if="!notification.checked"
                  @click="getThisReservation(notification)"
                >
                  {{ messageNotif(notification) }}
                </b-list-group-item>
            </template>
            <p
              v-if="countNotification === 0"
              class="m-1 text-center"
            >
              Aucune notification
            </p>
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
              <span>{{ userLogged.prenom }} {{ userLogged.nom }}</span>
            </div>
            <div class="mail">
              <span>{{ userLogged.mail }}</span>
            </div>
            <div class="role">
              <span>{{ userLogged.role.libelle === 'user' ? 'Utilisateur' : 'Administrateur' }}</span>
            </div>
            <div class="deco m-3">
              <b-button-group>
                <b-button variant="primary" @click="profil">Profil</b-button>
                <b-button variant="primary" @click="logout">Déconnexion</b-button>
              </b-button-group>
            </div>
          </div>
        </b-dropdown>
      </div>
    </div>
    <div class="menu-navigation-container" :class="{ 'open' : isBurgerActive }">
      <div class="menu-navigation">
        <img src="~@/assets/img/caraPark_logo.svg" alt="" class="logo">
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
            <li v-if="isAdmin">
              <router-link :to="{ name: 'ParkPortal' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'ParkPortal' || $route.name === 'ParkCar' ? 'active' : '']">
                <i class="kmap-icons icon-car-park nav-module-item-icon"></i>
                <span class="nav-module-item-name">Parc</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link :to="{ name: 'ReservePortal' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'ReservePortal' || $route.name === 'ReserveListSite' ? 'active' : '']">
                <i class="kmap-icons icon-reservation nav-module-item-icon"></i>
                <span class="nav-module-item-name">Réservation</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link :to="{ name: 'UserPortal' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'UserPortal' || $route.name === 'UserList' ? 'active' : '']">
                <i class="kmap-icons icon-users nav-module-item-icon"></i>
                <span class="nav-module-item-name">Utilisateurs</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <nav class="nav-module about">
          <ul>
            <li>
              <router-link :to="{ name: 'About' }" class="nav-module-item"
                           v-bind:class="[$route.name === 'About' ? 'active' : '']">
                <i class="kmap-icons icon-info nav-module-item-icon"></i>
                <span class="nav-module-item-name">KMAP</span>
              </router-link>
            </li>
          </ul>
        </nav>

      </div>
      <div class="menu-navigation-shadow" @click.prevent="toggle"></div>
    </div>
  </header>
</template>

<script lang="js" src="./AppNavbar.js"></script>
<style lang="scss" src="./AppNavbar.scss" rel="stylesheet"></style>
