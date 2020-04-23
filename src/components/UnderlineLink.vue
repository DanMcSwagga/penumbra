<template>
  <a class="underline-link" :href="link" target="_blank">{{ content }}</a>
</template>

<script>
export default {
  name: 'underline-link',

  props: {
    content: String,
    link: String
  }
}
</script>

<style lang="scss" scoped>
.underline-link {
  color: inherit;
  text-decoration: none;
  position: relative;
  z-index: 0;

  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 60%;
    left: -0.1em;
    right: -0.1em;
    bottom: 0;
    transition: top 0.2s cubic-bezier(0, 0.8, 0.13, 1);
    background-color: #ff1800;
  }
  &:hover:after {
    top: 0%;
  }
}
</style>
