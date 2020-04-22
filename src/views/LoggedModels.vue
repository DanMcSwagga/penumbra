<template>
  <div class="models">
    <h1>Models:</h1>
    <ul class="models__list">
      <li class="models__item" v-for="(item, i) in loggedModels" :key="i">
        <span class="models__item-action" @click="loadModel(item)">{{
          item.fileName
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'logged-models',

  computed: {
    ...mapState({ loggedModels: 'modelHistory' })
  },

  methods: {
    loadModel(model) {
      console.log({ ...model })
    }
  }
}
</script>

<style lang="scss" scoped>
.models {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__list {
    list-style: decimal-leading-zero;
  }

  &__item-action {
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
