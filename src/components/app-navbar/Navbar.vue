<template>
  <header v-if="hide">
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
          <span>Tableau de bord</span>
          {{ $route.name }}
          {{ $route.path }}
          {{ hide }}
        </div>
      </div>
      <div class="profil">
        <b-dropdown class="dropdown-avatar" variant="none" no-caret>
          <template v-slot:button-content>
            <div class="container-avatar">
              <i class="kmap-icons icon-avatar avatar"></i>
            </div>
          </template>
          <b-dropdown-item href="#">Profil</b-dropdown-item>
          <b-dropdown-item href="#">Déconnexion</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="menu-navigation-container" :class="{ 'open' : isBurgerActive }">
      <div class="menu-navigation">
        <img src="~@/assets/img/kmap_logo.svg" alt="" class="logo">
        <nav class="nav-module">
          <ul>
            <li>
              <a href="#" class="nav-module-item active">
                <i class="kmap-icons icon-dashboard nav-module-item-icon"></i>
                <span class="nav-module-item-name">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" class="nav-module-item">
                <i class="kmap-icons icon-module nav-module-item-icon"></i>
                <span class="nav-module-item-name">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" class="nav-module-item">
                <i class="kmap-icons icon-module nav-module-item-icon"></i>
                <span class="nav-module-item-name">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" class="nav-module-item">
                <i class="kmap-icons icon-module nav-module-item-icon"></i>
                <span class="nav-module-item-name">Dashboard</span>
              </a>
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
