<template>
  <div id="app" class="app">
    <ViewerHeader />
    <!-- <div id="nav"> -->
    <!-- <router-link to="/">Viewer</router-link> -->
    <!-- </div> -->
    <router-view />
  </div>
</template>

<script>
import ViewerHeader from '@/components/ViewerHeader.vue'

export default {
  components: {
    ViewerHeader
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Raleway', sans-serif;
  background: #f5f5f5;
  height: 100%;
  // overflow: hidden;
}

body {
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

.no-display {
  display: none;
}
.display {
  display: block;
}

.fixed {
  position: fixed;
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
