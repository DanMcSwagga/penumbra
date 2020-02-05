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
      const interFolder = this.gui.addFolder('Interaction')

      const controlCtrl = interFolder.add(this.sceneState, 'fpsControls')
      controlCtrl.onChange(() => this.$store.commit('updateControls'))
    },

    formDisplayControls() {
      const displayFolder = this.gui.addFolder('Display')

      // gridController watches for 'grid' change in 'sceneState'
      const gridCtrl = displayFolder.add(this.sceneState, 'grid')
      // gridController then calls some notifying mutation
      // that tells 'Scene' to call subscribed updateDisplay()
      gridCtrl.onChange(() => this.$store.commit('updateDisplay'))

      const wireframeCtrl = displayFolder.add(this.sceneState, 'wireframe')
      wireframeCtrl.onChange(() => this.$store.commit('updateDisplay'))
    },

    formLightingControls() {
      const lightFolder = this.gui.addFolder('Lighting')

      // TODO: try folder.add.onchange
      const exposureCtrl = lightFolder.add(this.sceneState, 'exposure', 0, 2)
      exposureCtrl.onChange(() => this.$store.commit('updateLighting'))
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
