<template>
  <div class="control-tab">
    <img class="control-tab__image" :src="content" :alt="type" />
  </div>
</template>

<script>
export default {
  name: 'control-tab',

  props: {
    content: { required: true },
    type: { required: true }
  }
}
</script>

<style lang="scss" scoped>
.control-tab {
  &__image {
    // temporary styles while control tab content is still an image
    height: 160px;
    border-radius: 3rem;
  }
}
</style>
