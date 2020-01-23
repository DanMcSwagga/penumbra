<template>
  <div id="header" class="header">
    <header>
      <h1 class="item"><a href="/">3D Model Viewer</a></h1>
      <span class="separator"> | </span>
      <button class="item" @click="isLoaded = true" v-if="!isLoaded">
        Start
      </button>
    </header>
  </div>
</template>

<script>
export default {
  name: 'viewer-header',

  computed: {
    isLoaded: {
      get: function() {
        return this.$store.state.isLoaded
      },
      set: function(boolValue) {
        this.$store.commit('set', { key: 'isLoaded', value: true })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  background: #353535;
  padding: 0 2em;
  height: 4rem;
  line-height: 4rem;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.3);
  z-index: 1;

  -webkit-app-region: drag;
}

header h1,
header .item,
header .separator {
  color: #f5f5f5;
  font-weight: 300;
  line-height: 4rem;
  margin: 0;
}

header h1 {
  font-size: 1.4rem;
}

header h1 > a {
  color: inherit;
  font-size: inherit;
  text-decoration: inherit;
}

header .item {
  padding: 0 1em;
  font-size: 0.8rem;
  text-decoration: none;
  transition: background ease 0.2s;

  -webkit-app-region: no-drag;
}

header .item:hover {
  background: #444;
}

header button.item {
  height: 34px;
  line-height: 35px;
  padding: 0 1em;
  margin: 0 1em;
  border: 0;
  background: #ffc107;
  color: #333;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
}

header button.item:hover {
  color: #000;
}

header .separator {
  margin: 0 0.2em;
  opacity: 0.2;
}
</style>
