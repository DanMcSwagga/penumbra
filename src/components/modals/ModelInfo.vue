<template>
  <div class="model-info">
    <ul class="model-info__tree tree">
      <TreeNode class="tree__node" :info="modelInfo" />
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TreeNode from '@/components/TreeNode'

export default {
  name: 'model-info',

  components: {
    TreeNode
  },

  computed: {
    ...mapState(['modelInfo']),

    isFolder() {
      return Array.isArray(this.modelInfo.value)
    }
  },

  data() {
    return {
      isOpen: false
    }
  }
}
</script>

<style lang="scss" scoped>
.model-info {
  font-family: Menlo, Consolas, monospace;

  &__tree {
    padding-left: 1.5em;
    line-height: 1.5em;
    list-style-type: disc;
  }
}
</style>
