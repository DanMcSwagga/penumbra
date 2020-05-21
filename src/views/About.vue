<template>
  <div class="about">
    <h1 class="about__heading">Penumbra</h1>
    <p class="about__paragraph">
      Interactive web-based viewer for 3D models, that allows a variety of
      visual features and effects. Inspect your 3D model data, play with
      lighting and shading, animation, environment controls and many more.
    </p>
    <p class="about__paragraph">
      Viewer provides support for 6 of the most widely used 3D model file types:
      .obj, .dae, .fbx, .stl, .3ds and .gltf/glb.
    </p>
    <p class="about__paragraph">
      The Penumbra project uses JavaScript's
      <UnderlineLink link="https://vuejs.org/" content="Vue.js" />
      framework and
      <UnderlineLink link="https://threejs.org/" content="Three.js" />
      library. Penumbra follows
      <UnderlineLink link="https://jamstack.org/" content="JAMStack" />
      methodology, and documentation of the project is available on official
      <UnderlineLink
        link="https://github.com/oddestdan/penumbra/"
        content="Github"
      />
      page.
    </p>
  </div>
</template>

<script>
import logoDark from '@/assets/logo_clean_dark.png'
import logoLight from '@/assets/logo_clean_light.png'
import UnderlineLink from '@/components/UnderlineLink.vue'

export default {
  name: 'about',

  data: () => ({ logoDark }),

  components: {
    UnderlineLink
  }
}
</script>

<style lang="scss" scoped>
@import '../palette.scss';

.about {
  // min-height: calc(100% - 8rem);
  min-height: 100%;
  width: 100%;
  padding: 4rem 20% 0 20%;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: flex-start;

  background-image: url('~@/assets/bg_logo_30.svg');
  background-position: center;
  background-size: 80%; // contain;
  background-clip: padding-box;
  background-repeat: no-repeat;
  background-attachment: fixed;

  &__paragraph {
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 1.4;
    margin: 1rem 0;
  }

  &__heading {
    font-size: 5rem;
  }

  &__link {
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
      background-color: $highlight-primary;
    }
    &:hover:after {
      top: 0%;
    }
  }
}
</style>
