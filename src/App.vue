<template>
  <div id="app" class="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  components: {
    Header
  }
}
</script>

<style lang="scss">
@import './palette.scss';

html,
body {
  margin: 0;
  padding: 0;
  // font-family: 'Roboto', sans-serif;
  font-family: 'Montserrat', sans-serif;
  background: $tertiary;
  height: 100%;
  // overflow: hidden; // TODO: implement at later stages
}

body {
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

.no-display {
  display: none !important;
}
.display {
  display: block;
}
.fixed {
  position: fixed;
}
.hidden {
  visibility: hidden;
}

.app {
  display: flex;
  width: 100vw;
  flex-grow: 1;
  position: relative;
  flex-direction: column;
  // height: 100vh;
}
</style>
