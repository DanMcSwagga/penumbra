<template>
  <div class="gui-wrapper" :ref="'gui-wrapper'"></div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

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

      this.$refs['gui-wrapper'].appendChild(this.gui.domElement)
      this.gui.open()
    },

    formInteractionControls() {
      const dispayFolder = this.gui.addFolder('Interaction')

      const controlController = dispayFolder.add(this.sceneState, 'fpsControls')
      controlController.onChange(() => this.$store.commit('updateControls'))
    },

    formDisplayControls() {
      const dispayFolder = this.gui.addFolder('Display')

      // gridController watches for 'grid' change in 'sceneState'
      const gridController = dispayFolder.add(this.sceneState, 'grid')
      // gridController then calls some notifying mutation
      // that tells 'Scene' to call subscribed updateDisplay()
      gridController.onChange(() => this.$store.commit('updateDisplay'))

      const wireframeController = dispayFolder.add(this.sceneState, 'wireframe')
      wireframeController.onChange(() => this.$store.commit('updateDisplay'))
    },

    formLightingControls() {
      const dispayFolder = this.gui.addFolder('Lighting')

      const fakeState = { exposure: 1.0 }
      const exposureController = dispayFolder.add(fakeState, 'exposure', 0, 2)
      exposureController.onChange(() => /*this.updateDisplay()*/ {})
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
