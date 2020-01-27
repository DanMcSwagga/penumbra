<template>
  <main id="viewer" class="viewer">
    <GUI />
    <div class="dropzone" id="dropzone" :ref="'dropzone'">
      <Scene :class="{ 'no-display': !isLoaded }" />
      <!-- TODO: create a separate component just for placeholder -->
      <UploadPlaceholder :class="{ 'no-display': isLoaded }" />
    </div>
    <div class="spinner" v-if="showSpinner" :ref="'spinner'"></div>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { SimpleDropzone } from 'simple-dropzone'

import GUI from '@/components/GUI.vue'
import Scene from '@/components/Scene.vue'
import UploadPlaceholder from '@/components/UploadPlaceholder.vue'

export default {
  name: 'viewer',

  components: {
    GUI,
    Scene,
    UploadPlaceholder
  },

  computed: {
    ...mapState(['showSpinner', 'showDropzone'])
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
    // TODO: move Load() from Viewer to store ??
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
      // if (this.viewer) this.viewer.clear()
      // const viewer = this.viewer || this.createViewer()

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
  flex-direction: column; // TODO: rethink later
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

.placeholder {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
}

.placeholder-label {
  width: 100%;
  max-width: 500px;
  border-radius: 0.5em;
  background: #eee;
  padding: 2em;
  text-align: center;

  p {
    font-size: 1.2rem;
    color: #999;
  }
}

/******************************************************************************
 * Upload Button
 *
 * https://tympanus.net/Tutorials/CustomFileInputs/
 */

.upload-btn {
  margin-top: 2em;
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  label {
    color: #353535;
    border: 0;
    border-radius: 3px;
    transition: ease 0.2s background;
    font-size: 1rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    padding: 0.625rem 1.25rem;
  }
  label:hover {
    background: #ddd;
  }
  svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    margin-top: -0.25em;
    margin-right: 0.25em;
  }
}

/******************************************************************************
 * CSS Spinner
 *
 * http://tobiasahlin.com/spinkit/
 */

.spinner {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -20px;

  background-color: #333;

  border-radius: 100%;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>
