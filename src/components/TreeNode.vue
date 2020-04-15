<template>
  <li class="tree-node">
    <div
      class="tree-node__key"
      :class="{ 'tree-node__key--folder': isFolder }"
      @click="toggle"
    >
      {{ info.key }}
      <template>
        <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
        <span v-else>: {{ info.value }}</span>
      </template>
    </div>
    <ul class="tree-node__branch" v-show="isOpen" v-if="isFolder">
      <tree-node
        v-for="(node, index) in info.value"
        :key="index"
        :info="node"
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
      return Array.isArray(this.info.value)
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

  &__key {
    &--folder {
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
