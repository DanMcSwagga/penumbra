<template>
  <div class="gui-wrapper" :ref="'gui-wrapper'"></div>
</template>

<script>
import { GUI } from 'dat.gui'

export default {
  name: 'gui',

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

      this.formDisplayControls()
      this.formLightingControls()
      //
      this.$refs['gui-wrapper'].appendChild(this.gui.domElement)
      this.gui.open() // works?
    },

    formDisplayControls() {
      const dispayFolder = this.gui.addFolder('Display')

      const fakeState = {
        grid: false
      }

      const gridController = dispayFolder.add(fakeState, 'grid')
      gridController.onChange(() => /*this.updateDisplay()*/ {})
    },

    formLightingControls() {
      const dispayFolder = this.gui.addFolder('Lighting')

      const fakeState = {
        exposure: 1.0
      }

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
  // top: 0;
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
