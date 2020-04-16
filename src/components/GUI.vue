<template>
  <div class="gui-wrapper" :ref="'gui-wrapper'">
    <!-- Dat GUI generates here -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { sRGBEncoding as sRGB, LinearEncoding as Linear } from 'three'
import { GUI } from 'dat.gui'
import { environments } from '../data/environments'

export default {
  name: 'gui',

  computed: {
    ...mapState(['foldersGUI', 'sceneState'])
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
      this.gui = new GUI({ autoPlace: false, width: 320, hideable: true })

      this.formInteractionControls()
      this.formDisplayControls()
      this.formEnvironmentControls()
      this.formAnimationControls()
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
        .onChange(() => this.$store.commit('UPDATE_CONTROLS'))

      interFolder
        .add(this.sceneState, 'cameraAutoplay')
        .onChange(() => this.$store.commit('UPDATE_CAMERA'))
    },

    formDisplayControls() {
      const displayFolder = this.gui.addFolder('Display')

      displayFolder
        .add(this.sceneState, 'grid')
        .onChange(() => this.$store.commit('UPDATE_DISPLAY'))

      displayFolder
        .add(this.sceneState, 'axes')
        .onChange(() => this.$store.commit('UPDATE_DISPLAY'))

      displayFolder
        .add(this.sceneState, 'wireframe')
        .onChange(() => this.$store.commit('UPDATE_DISPLAY'))

      displayFolder
        .add(this.sceneState, 'skeleton')
        .onChange(() => this.$store.commit('UPDATE_DISPLAY'))
    },

    formEnvironmentControls() {
      const envFolder = this.gui.addFolder('Environment')

      envFolder
        .add(this.sceneState, 'background')
        .onChange(() => this.$store.commit('UPDATE_ENVIRONMENT'))
      envFolder
        .add(this.sceneState, 'environment', environments.map(env => env.name))
        .onChange(() => this.$store.commit('UPDATE_ENVIRONMENT'))
    },

    formAnimationControls() {
      const animFolder = this.gui.addFolder('Animation')

      animFolder.add({ play: () => this.$store.commit('PLAY_CLIPS') }, 'play')

      animFolder
        .add(this.sceneState, 'playbackSpeed', 0, 1)
        .onChange(speed => this.$store.commit('UPDATE_ANIMATION', speed))
    },

    formLightingControls() {
      const lightFolder = this.gui.addFolder('Lighting')

      lightFolder
        .addColor(this.sceneState, 'ambientColor')
        .listen()
        .onChange(() => this.$store.commit('UPDATE_LIGHTING'))

      lightFolder
        .addColor(this.sceneState, 'directColor')
        .listen()
        .onChange(() => this.$store.commit('UPDATE_LIGHTING'))

      lightFolder
        .add(this.sceneState, 'ambientIntensity', 0, 2)
        .listen()
        .onChange(() => this.$store.commit('UPDATE_LIGHTING'))

      lightFolder
        .add(this.sceneState, 'directIntensity', 0, 4)
        .listen()
        .onChange(() => this.$store.commit('UPDATE_LIGHTING'))

      lightFolder
        .add(this.sceneState, 'exposure', 0, 2)
        .listen()
        .onChange(() => this.$store.commit('UPDATE_LIGHTING'))

      lightFolder.add(
        { reset: () => this.$store.commit('RESET_LIGHTING') },
        'reset'
      )

      lightFolder
        .add(this.sceneState, 'disableLighting')
        .listen()
        .onChange(() => this.$store.commit('UPDATE_LIGHTING'))
    },

    formEncodingControls() {
      const encodingFolder = this.gui.addFolder('Encoding')

      encodingFolder
        .add(this.sceneState, 'outputEncoding', { sRGB, Linear })
        .onChange(() => this.$store.commit('UPDATE_ENCODING'))

      encodingFolder
        .add(this.sceneState, 'textureEncoding', { sRGB, Linear })
        .onChange(() => this.$store.commit('UPDATE_ENCODING'))
    }
  }
}
</script>

<style lang="scss">
.gui-wrapper {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  pointer-events: none;

  .main {
    pointer-events: all;
    max-height: 100%;
    overflow: auto;

    .close-button {
      background-color: #2b2b2b;
      padding: 4px 0;
      line-height: auto;
      height: auto;
      &:hover {
        background-color: #242424;
      }
    }
  }
}

.dg {
  font-family: Consolas;
  font-weight: 300;
  font-size: 12px;

  .folder {
    .dg {
      li.title {
        // font-weight: 900;
        background-color: #363537;
        &:hover {
          background-color: #434244;
        }
      }
    }
  }

  ul {
    li:not(.folder) {
      border-left: 4px solid rgba(0, 0, 0, 0);
      border-bottom: none;
    }
    li.cr {
      padding-left: 10px;
      margin-left: 10px;
      border-left-width: 4px !important;
      background-color: #2b2b2b;
      &:hover {
        background-color: #313131 !important;
      }
    }
    li.title {
      padding-left: 24px;
      border-bottom-color: rgba(0, 0, 0, 0);
      background-position: 8px center;
    }
  }

  li.gui-stats:not(.folder) {
    height: auto;
  }

  .slider {
    margin-left: 0px;
  }

  .c {
    input[type='checkbox'] {
      margin-left: 0px;
    }
  }

  .selector {
    margin-left: -16px;
  }
}
</style>
