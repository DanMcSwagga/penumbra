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
import Scene from '@/components/Scene.vue'
import UploadPlaceholder from '@/components/UploadPlaceholder.vue'
import Spinner from '@/components/Spinner.vue'

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
      .on('dropstart', () => self.$store.commit('activateSpinner'))
      .on('droperror', () => self.$store.commit('deactivateSpinner'))
  },

  methods: {
    // TODO: move Load() from Viewer to store (?)
    load(fileMap) {
      let rootFile
      let rootPath

      console.log('Map of file(s)...')
      console.dir(fileMap)
      // if (Object.entries(fileMap).length === 1) {
      // }

      // Key: filePath | value: fileName
      Array.from(fileMap).forEach(([path, file]) => {
        if (file.name.match(/\.(gltf|glb)$/)) {
          rootFile = file
          rootPath = path.replace(file.name, '')
        }
      })

      if (!rootFile) {
        this.onError('No .gltf or .glb asset found.')
      }

      this.view(rootFile, rootPath, fileMap)
    },

    view(rootFile, rootPath, fileMap) {
      const fileURL =
        typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile)

      // Save fileUrl, rootPath and fileMap to global $store state
      this.$store.dispatch('saveFile', { fileURL, rootPath, fileMap })

      this.isLoaded = true
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
