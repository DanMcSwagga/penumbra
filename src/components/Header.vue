<template>
  <header class="header">
    <router-link class="header__logo-link" to="/">
      <img class="header__logo" :src="logoDark" alt="Penumbra Logo" />
    </router-link>

    <span class="header__item">
      <router-link class="header__nav-link" to="/about">About</router-link>
    </span>

    <template v-if="isModelLoaded">
      <span class="header__separator">|</span>
      <span class="header__item" @click="toggleModalTutorial">
        <span class="header__nav-link">Tutorial</span>
      </span>
      <span class="header__item" @click="toggleModalModelInfo">
        <span class="header__nav-link">Model Info</span>
      </span>
    </template>
  </header>

  <!-- TODO: improve structure using BEM -->

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
import { mapState, mapMutations } from 'vuex'
import logoDark from '@/assets/logo_clean_dark.png'
import logoLight from '@/assets/logo_clean_light.png'

export default {
  name: 'viewer-header',

  data: () => ({ logoDark }),

  computed: {
    ...mapState(['fileMap', 'showModelInfo', 'showTutorial']),

    isModelLoaded() {
      return this.fileMap
    }
  },

  methods: {
    toggleModalTutorial() {
      this.$store.commit('TOGGLE_MODAL_TUTORIAL')
    },
    toggleModalModelInfo() {
      this.$store.commit('TOGGLE_MODAL_MODEL_INFO')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../palette.scss';
@import '../media_mixins.scss';

// TODO: improve SCSS using BEM
.header {
  position: fixed;
  width: 100%;

  display: flex;
  padding: 0 2em;
  height: 4rem;
  line-height: 4rem;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  z-index: 1;

  @include phone {
    justify-content: center;
    background-color: rgba($color: $tertiary, $alpha: 0.3);
  }

  &__item,
  &__separator {
    color: $primary;
    line-height: 4rem;
    margin: 0;
  }

  &__logo {
    vertical-align: middle;
    width: 2.5rem;
    margin: 0 0.5em;
    cursor: pointer;
  }
  &__logo-link {
    transition: transform 0.2s cubic-bezier(0, 0.8, 0.13, 1);
    &:hover {
      transform: scale(1.1);
    }
  }

  &__item {
    padding: 0 1em;
    font-size: 1.25rem;
    text-decoration: none;
    transition: background ease 0.3s;
  }

  &__item_hoverable:hover {
    background: #444;
  }

  &__separator {
    margin: 0 0.2em;
  }

  &__nav-link {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    position: relative;
    z-index: 0;

    &:after {
      content: '';
      position: absolute;
      z-index: -1;
      top: 70%;
      left: -0.1em;
      right: -0.1em;
      bottom: 0;
      transition: top 0.2s cubic-bezier(0, 0.8, 0.13, 1);
      background-color: $highlight-secondary;
    }
    &:hover:after {
      top: 0%;
    }
  }
}
</style>
