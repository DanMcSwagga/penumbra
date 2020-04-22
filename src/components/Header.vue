<template>
  <header class="header">
    <img class="header__logo" :src="logo" alt="Penumbra Logo" />
    <span class="header__item">
      <router-link to="/">Viewer</router-link>
    </span>

    <span class="header__separator">|</span>
    <span class="header__item">
      <router-link to="/models">Models</router-link>
    </span>

    <template v-if="isModelLoaded">
      <span class="header__separator">|</span>
      <span class="header__item">
        <router-link to="/info">Model Info</router-link>
      </span>
    </template>
  </header>

  <!-- TODO: IMPORTANT!!! improve structure using BEM -->

  <!-- <header class="header">
    <nav class="header__navigation">
      <ul class="header__list">
        <li class="header__li">
          <img class="header__logo" :src="logo" alt="Penumbra Logo" />
        </li>
        <li class="header__li">
          <span class="header__separator">|</span>
        </li>
        <li class="header__li">
          <span class="header__item">Currently supports GLTF/GLB files</span>
        </li>
      </ul>
  </nav>-->
</template>

<script>
import logo from '../assets/logo_clean_dark.png'
import { mapState } from 'vuex'

export default {
  name: 'viewer-header',

  data: () => ({ logo }),

  computed: {
    ...mapState(['fileMap']),

    isModelLoaded() {
      return this.fileMap
    }
  }
}
</script>

<style lang="scss" scoped>
// TODO: improve SCSS using BEM
.header {
  position: fixed;

  display: flex;
  // background-color: #353535;
  padding: 0 2em;
  height: 4rem;
  line-height: 4rem;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  z-index: 1;

  -webkit-app-region: drag;

  h1,
  &__item,
  &__separator {
    color: #1e1e1e;
    font-weight: 300;
    line-height: 4rem;
    margin: 0;
  }

  &__logo {
    height: 32px;
    width: 32px;
    margin: 0 1em;
  }
  h1 {
    font-size: 1.4rem;
  }

  h1 > a {
    color: inherit;
    font-size: inherit;
    text-decoration: inherit;
  }

  &__item {
    padding: 0 1em;
    font-size: 1rem;
    text-decoration: none;
    transition: background ease 0.3s;

    -webkit-app-region: no-drag;
  }

  &__item_hoverable:hover {
    background: #444;
  }

  // button.item {
  //   height: 34px;
  //   line-height: 35px;
  //   padding: 0 1em;
  //   margin: 0 1em;
  //   border: 0;
  //   background-color: #00e7ff;
  //   color: #333;
  //   font-weight: 600;
  //   border-radius: 2px;
  //   cursor: pointer;
  // }

  // button.item:hover {
  //   color: #000;
  //   background-color: #ffffff;
  // }

  &__separator {
    margin: 0 0.2em;
  }
}
</style>
