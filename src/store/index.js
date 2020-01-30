import Vue from 'vue'
import Vuex from 'vuex'

// import * as THREE from 'three'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // isLoaded: false,
    showSpinner: false,

    // File loading stuff
    fileURL: '',
    rootPath: '',
    fileMap: {},
    sceneState: {
      grid: false,
      wireframe: false
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

    updateDisplay: state => {
      console.log('~~ Notifying from store about updateDisplay')
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
