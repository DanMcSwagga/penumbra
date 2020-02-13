import Vue from 'vue'
import Vuex from 'vuex'

// import * as THREE from 'three'
import { sRGBEncoding, LinearEncoding } from 'three'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showSpinner: false,

    // File loading
    fileURL: '',
    rootPath: '',
    fileMap: {},

    // GUI variables
    sceneState: {
      // Interaction
      fpsControls: false,
      cameraAutoplay: false,

      // Display
      grid: false,
      wireframe: false,
      skeleton: false,

      // Animation
      playbackSpeed: 1.0,

      // Lighting
      ambientColor: 0xffffff,
      directColor: 0xffffff,
      ambientIntensity: 0.4,
      directIntensity: 0.8 * Math.PI,
      exposure: 1.0,
      disableLighting: false,

      // Encoding
      outputEncoding: sRGBEncoding,
      textureEncoding: sRGBEncoding
    }
  },

  mutations: {
    set: (state, { key, value }) => (state[key] = value),

    activateSpinner: state => {
      state.showSpinner = true
    },
    deactivateSpinner: state => {
      state.showSpinner = false
    },

    setFileData: (state, { fileURL, rootPath, fileMap }) => {
      // TODO: create more elegant way of assigning these values
      state.fileURL = fileURL
      state.rootPath = rootPath
      state.fileMap = fileMap
    },
    resetFileData: state => {
      state.fileURL = ''
      state.rootPath = ''
      state.fileMap = null
    },

    setDefaultLighting: state => {
      state.sceneState.ambientColor = 0xffffff
      state.sceneState.directColor = 0xffffff
      state.sceneState.ambientIntensity = 0.4
      state.sceneState.directIntensity = 0.8 * Math.PI
      state.sceneState.exposure = 1.0
    },

    updateCamera: () => console.log('~~ updateCamera notifier'),
    updateControls: () => console.log('~~ updateControls notifier'),
    updateDisplay: () => console.log('~~ updateDisplay notifier'),
    playClips: () => console.log('~~ playClips notifier'),
    updateAnimation: (state, speed) => (state.playbackSpeed = speed),
    updateLighting: () => /* console.log('~~ updateLighting notifier') */ {},
    resetLighting: () => console.log('~~ resetLighting notifier'),
    updateEncoding: () => console.log('~~ updateEncoding notifier')
  },

  actions: {
    saveFile({ commit }, fileData) {
      console.log('~~~ Saving file data to global state...')
      // console.dir(fileData)
      commit('setFileData', fileData)
    },
    resetFile({ commit }) {
      console.log('~~~ Resetting file data to prepare for new model...')
      commit('resetFileData')
    }
  },
  modules: {}
})
