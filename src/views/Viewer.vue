<template>
  <main id="viewer" class="viewer">
    <!-- TODO: arrange as views/ModalTutorial -->
    <Modal v-if="showTutorial" @close="toggleModalTutorial">
      <p slot="body">This is some other shiet</p>
    </Modal>
    <!-- TODO: arrange as views/ModalModelInfo -->
    <Modal v-if="showModelInfo" @close="toggleModalModelInfo">
      <p slot="body">This is some custom shiet</p>
    </Modal>

    <div class="dropzone" id="dropzone" :ref="'dropzone'">
      <GUI :class="{ 'no-display': !isLoaded }" />
      <Scene :class="{ 'no-display': !isLoaded }" />
      <UploadPlaceholder :class="{ 'no-display': isLoaded }" />
    </div>
    <Spinner v-if="showSpinner" :ref="'spinner'" />
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { SimpleDropzone } from 'simple-dropzone'

import GUI from '@/components/GUI.vue'
import Scene from '@/components/Scene/Scene.vue'
import UploadPlaceholder from '@/components/UploadPlaceholder.vue'
import Spinner from '@/components/Spinner.vue'
import Modal from '@/components/Modal.vue'

import { ALLOW_FILE_TYPE } from '@/utils/supportedTypes.js'

export default {
  name: 'viewer',

  components: {
    GUI,
    Scene,
    UploadPlaceholder,
    Spinner,
    Modal
  },

  computed: {
    ...mapState(['showSpinner', 'showModelInfo', 'showTutorial'])
  },

  data() {
    return {
      isLoaded: false
    }
  },

  mounted() {
    const dropzoneController = new SimpleDropzone(
      // Unable to use refs due to file-input and drop-zone being
      // on completely different component levels
      document.getElementById('dropzone'),
      document.getElementById('file-input')
    )

    dropzoneController
      .on('drop', ({ files }) => {
        console.log('CHECKING DROPZONE FILESOBJ...')
        console.log(files)
        this.load(files)
      })
      .on('dropstart', () => {
        this.$store.commit('ACTIVATE_SPINNER')
      })
      .on('droperror', () => {
        this.$store.commit('DEACTIVATE_SPINNER')
      })
  },

  methods: {
    toggleModalTutorial() {
      this.$store.commit('TOGGLE_MODAL_TUTORIAL')
    },
    toggleModalModelInfo() {
      this.$store.commit('TOGGLE_MODAL_MODEL_INFO')
    },

    load(fileMap) {
      let rootFile
      let rootPath
      let fileType

      console.log('Map of file(s)...')
      console.dir(fileMap)

      Array.from(fileMap).forEach(([path, file]) => {
        if (file.name.match(ALLOW_FILE_TYPE)) {
          // TODO: check if there has already been an allowed type file, e.g.
          // if (!rootFile)
          // // execute code
          // else
          // // "File entry point has been declared, can't parse multiple 3D files"

          rootFile = file

          // Get file type to determine model loader type later
          fileType = file.name
            .split('.')
            .pop()
            .toLowerCase()

          rootPath = path.replace(file.name, '')
        }
      })

      if (!rootFile) {
        // TODO: create a more legible error string
        this.onError(`No ${ALLOW_FILE_TYPE} asset found.`)
      }

      this.view(rootFile, rootPath, fileMap, fileType)
    },

    view(rootFile, rootPath, fileMap, fileType) {
      const fileURL =
        typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile)

      // Save fileData to global VueX storage
      const fileData = { fileURL, rootPath, fileMap, fileType }
      this.$store.dispatch('saveFileData', fileData)

      // Save fileData as model to global VueX storage
      const modelData = { fileName: rootFile.name, fileType }
      this.$store.dispatch('saveModelToHistory', modelData)

      this.isLoaded = true

      console.log('LocalStorage Model History...')
      console.dir(JSON.parse(localStorage.modelHistory))
    },

    onError(error) {
      let message = (error || {}).message || error.toString()
      if (message.match(/ProgressEvent/)) {
        message =
          'Unable to retrieve this file. Check JS console and browser network tab.'
      } else if (message.match(/Unexpected token/)) {
        message = `Unable to parse file content. Verify that this file is valid. Error: "${message}"`
      } else if (error && error.target && error.target instanceof Image) {
        message = 'Missing texture: ' + error.target.src.split('/').pop()
      }
      window.alert(message)
      console.error(error)
    }
  }
}
</script>

<style lang="scss">
.viewer {
  display: flex;
  flex-direction: column;
  width: 100vw;
  flex-grow: 1;
  position: relative;
}

.dropzone {
  display: flex;
  // flex-grow: 1;
  // width: 100vw;
  justify-content: center;
  align-items: center;
  // TODO
  width: 100%;
  height: 100%;
}
</style>
