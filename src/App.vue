<template>
  <div id="app">
    <!-- <div id="nav"> -->
    <!-- <router-link to="/">Viewer</router-link> -->
    <!-- </div> -->
    <router-view />
  </div>
</template>

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
</style>
