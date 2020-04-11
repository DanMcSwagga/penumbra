<template>
  <main id="viewer" class="viewer">
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

import { ALLOW_FILE_TYPE } from '@/utils/supportedTypes.js'

export default {
  name: 'viewer',

  components: {
    GUI,
    Scene,
    UploadPlaceholder,
    Spinner
  },

  computed: {
    ...mapState(['showSpinner'])
  },

  data() {
    return {
      isLoaded: false
    }
  },

  mounted() {
    const dropzoneController = new SimpleDropzone(
      // this.$refs['dropzone'],
      // this.$refs['file-input'] // now is in a child component
      document.getElementById('dropzone'),
      document.getElementById('file-input')
    )
    const self = this
    dropzoneController
      .on('drop', ({ files }) => self.load(files))
      .on('dropstart', () => self.$store.commit('ACTIVATE_SPINNER'))
      .on('droperror', () => self.$store.commit('DEACTIVATE_SPINNER'))
  },

  methods: {
    load(fileMap) {
      let rootFile
      let rootPath
      let fileType

      console.log('Map of file(s)...')
      console.dir(fileMap)

      // TODO: Check for file type here and add type to store
      // which will determine what type of loader to use later

      // Key: filePath | value: fileName
      Array.from(fileMap).forEach(([path, file]) => {
        if (file.name.match(ALLOW_FILE_TYPE)) {
          // check if there has already been an allowed type file, e.g.
          // if (!rootFile) ...
          // else display error
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
