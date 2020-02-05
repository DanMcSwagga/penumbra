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

      // Display
      grid: false,
      wireframe: false,

      // Lighting
      exposure: 1.0,
      outputEncoding: sRGBEncoding
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

    updateControls: state => console.log('~~ updateControls notifier'),
    updateDisplay: state => console.log('~~ updateDisplay notifier'),
    updateLighting: state => console.log('~~ updateLighting notifier'),
    updateEncoding: state => console.log('~~ updateEncoding notifier'),

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
    }
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
