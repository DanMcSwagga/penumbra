<template>
  <div class="model-info">
    <!-- TODO: Store model info in VueX and then use here -->

    <!-- Mocked model info for now -->
    <ul class="model-info__tree tree">
      <TreeNode :info="mockTreeData" />
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
    // ...mapState(['modelInfo']),

    isFolder() {
      return this.mockTreeData.children && this.mockTreeData.children.length
    }
  },

  data() {
    return {
      isOpen: false,

      mockTreeData: {
        name: 'My Tree',
        children: [
          { name: 'hello' },
          { name: 'wat' },
          {
            name: 'child folder',
            children: [
              {
                name: 'child folder',
                children: [{ name: 'hello' }, { name: 'wat' }]
              },
              { name: 'hello' },
              { name: 'wat' },
              {
                name: 'child folder',
                children: [{ name: 'hello' }, { name: 'wat' }]
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.model-info {
  font-family: Menlo, Consolas, monospace;

  padding-top: 100px; // TODO: remove, adaptify

  &__tree {
    padding-left: 1.5em;
    line-height: 1.5em;
    list-style-type: disc;
  }
}
</style>
