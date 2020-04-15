<template>
  <li class="tree-node">
    <div :class="{ isFolder }" @click="toggle">
      {{ info.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul class="tree-node__branch" v-show="isOpen" v-if="isFolder">
      <tree-node
        v-for="(child, index) in info.children"
        :key="index"
        :info="child"
      ></tree-node>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'tree-node',

  props: {
    info: Object
  },

  data() {
    return {
      isOpen: false
    }
  },

  computed: {
    isFolder() {
      return this.info.children && this.info.children.length
    }
  },

  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-node {
  &__branch {
    padding-left: 1.5em;
    line-height: 1.5em;
    list-style-type: disc;
  }
}

.isFolder {
  font-weight: bold;
  cursor: pointer;
}
</style>
