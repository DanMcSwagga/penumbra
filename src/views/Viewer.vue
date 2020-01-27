<template>
  <div id="viewer" class="viewer">
    <GUI />
    <!-- TODO: needed? -->
    <main class="viewer-container">
      <Scene :class="{ 'no-display': !isLoaded }" />
      <!-- <Dropzone /> -->
      <div
        class="dropzone"
        :ref="'dropzone'"
        :class="{ 'no-display': isLoaded }"
      >
        <div class="placeholder">
          <div class="placeholder-label">
            <p>Drag glTF 2.0 file or folder here</p>
          </div>
          <div class="upload-btn">
            <input
              type="file"
              name="file-input[]"
              id="file-input"
              multiple=""
              :ref="'file-input'"
            />
            <label for="file-input">
              <span>Upload</span>
            </label>
          </div>
        </div>
      </div>
      <div class="spinner" v-if="showSpinner" :ref="'spinner'"></div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { SimpleDropzone } from 'simple-dropzone'

import GUI from '@/components/GUI.vue'
// import FileUpload from '@/components/FileUpload.vue'
import Scene from '@/components/Scene.vue'

export default {
  name: 'viewer',

  components: {
    GUI,
    Scene
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
      this.$refs['dropzone'],
      this.$refs['file-input']
    )
    const self = this
    dropzoneController
      .on('drop', ({ files }) => this.load(files))
      .on('dropstart', () => self.$store.commit('activateSpinner'))
      .on('droperror', () => self.$store.commit('deactivateSpinner'))
  },

  methods: {
    load(fileMap) {
      let rootFile
      let rootPath

      console.dir(fileMap)
      console.log('List of file(s)...')
      // if (Object.entries(fileMap).length === 1) {
      // }

      // Key: filePath | value: fileName
      Array.from(fileMap).forEach(([path, file]) => {
        console.log(`File: ${file.name}`)
        if (file.name.match(/\.(gltf|glb)$/)) {
          rootFile = file
          rootPath = path.replace(file.name, '')
        }
      })

      if (!rootFile) {
        this.onError('No .gltf or .glb asset found.')
      }

      console.log('before this.view:')
      console.dir(rootFile)
      console.dir(rootPath)
      console.dir(fileMap)
      this.view(rootFile, rootPath, fileMap)
    },

    view(rootFile, rootPath, fileMap) {
      // if (this.viewer) this.viewer.clear()

      // const viewer = this.viewer || this.createViewer()

      const fileURL =
        typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile)

      const cleanup = () => {
        this.hideSpinner()
        if (typeof rootFile === 'object') URL.revokeObjectURL(fileURL)
      }

      // Save fileUrl, rootPath and fileMap to global state
      // so Viewer can access them via $store

      console.log('before this.load:')
      console.dir(fileURL)
      console.dir(rootPath)
      console.dir(fileMap)
      this.$store.dispatch('passLoadToViewer', { fileURL, rootPath, fileMap })

      // viewer
      // .load(fileURL, rootPath, fileMap)
      // .catch(e => this.onError(e))
      // .then(gltf => {
      //   // if (!this.options.kiosk) {
      //   // this.validationCtrl.validate(fileURL, rootPath, fileMap, gltf)
      //   // }
      //   cleanup()
      // })
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

.viewer-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  flex-grow: 1;
  position: relative;
  justify-content: center;
  align-items: center;
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
