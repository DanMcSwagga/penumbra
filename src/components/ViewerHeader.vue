<template>
  <header>
    <img class="logo" :src="logo" alt="Penumbra Logo" />
    <span class="separator"> | </span>
    <h1 class="item item_hoverable"><a href="/">3D Model Viewer</a></h1>
    <span class="separator"> | </span>
    <span class="item">Currently supports GLTF/GLB and FBX files</span>
    <!-- <span class="separator"> | </span> -->
    <!-- <button class="item">Load Sample</button> -->
  </header>
</template>

<script>
import logo from '../assets/logo_clean_dark.png'

export default {
  name: 'viewer-header',

  data: () => ({ logo })
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

  h1,
  .item,
  .separator {
    color: #f5f5f5;
    font-weight: 300;
    line-height: 4rem;
    margin: 0;
  }

  .logo {
    height: 28px;
    width: 28px;
    margin: 0 1em;
  }
  h1 {
    font-size: 1.4rem;
  }

  h1 > a {
    color: inherit;
    font-size: inherit;
    text-decoration: inherit;
  }

  .item {
    padding: 0 1em;
    font-size: 0.8rem;
    text-decoration: none;
    transition: background ease 0.3s;

    -webkit-app-region: no-drag;
  }

  .item_hoverable:hover {
    background: #444;
  }

  button.item {
    height: 34px;
    line-height: 35px;
    padding: 0 1em;
    margin: 0 1em;
    border: 0;
    background-color: #00e7ff;
    color: #333;
    font-weight: 600;
    border-radius: 2px;
    cursor: pointer;
  }

  button.item:hover {
    color: #000;
    background-color: #ffffff;
  }

  .separator {
    margin: 0 0.2em;
    opacity: 0.2;
  }
}
</style>
