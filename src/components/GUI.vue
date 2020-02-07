<template>
  <div class="gui-wrapper" :ref="'gui-wrapper'"></div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { sRGBEncoding as sRGB, LinearEncoding as Linear } from 'three'

import { GUI } from 'dat.gui'

export default {
  name: 'gui',

  computed: {
    ...mapState(['sceneState'])
  },

  data() {
    return {
      gui: null
    }
  },

  mounted() {
    this.formGUI()
  },

  methods: {
    formGUI() {
      this.gui = new GUI({ autoPlace: false, width: 300, hideable: true })

      this.formInteractionControls()
      this.formDisplayControls()
      this.formLightingControls()
      this.formEncodingControls()

      this.$refs['gui-wrapper'].appendChild(this.gui.domElement)
      this.gui.open()
    },

    formInteractionControls() {
      const interFolder = this.gui.addFolder('Interaction')

      // Watches for 'fpsControls' change in 'sceneState', then calls a
      // notifier-mutation, so 'Scene' calls subscribed 'updateControls()'
      interFolder
        .add(this.sceneState, 'fpsControls')
        .onChange(() => this.$store.commit('updateControls'))

      interFolder
        .add(this.sceneState, 'cameraAutoplay')
        .onChange(() => this.$store.commit('updateCamera'))
    },

    formDisplayControls() {
      const displayFolder = this.gui.addFolder('Display')

      displayFolder
        .add(this.sceneState, 'grid')
        .onChange(() => this.$store.commit('updateDisplay'))

      displayFolder
        .add(this.sceneState, 'wireframe')
        .onChange(() => this.$store.commit('updateDisplay'))

      displayFolder
        .add(this.sceneState, 'skeleton')
        .onChange(() => this.$store.commit('updateDisplay'))
    },

    formLightingControls() {
      const lightFolder = this.gui.addFolder('Lighting')

      lightFolder
        .add(this.sceneState, 'enableLighting')
        .listen()
        .onChange(() => this.$store.commit('updateLighting'))

      lightFolder
        .add(this.sceneState, 'exposure', 0, 2)
        .onChange(() => this.$store.commit('updateLighting'))
    },

    formEncodingControls() {
      const encodingFolder = this.gui.addFolder('Encoding')

      encodingFolder
        .add(this.sceneState, 'outputEncoding', { sRGB, Linear })
        .onChange(() => this.$store.commit('updateEncoding'))
    }
  }
}
</script>

<style lang="scss">
.gui-wrapper {
  position: absolute;
  // position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
  // bottom: 0;
  pointer-events: none;
  > .main {
    pointer-events: all;
    max-height: 100%;
    overflow: auto;
  }
}

.dg li.gui-stats:not(.folder) {
  height: auto;
}
</style>
