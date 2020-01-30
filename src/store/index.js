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
      grid: false
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

    updateGrid: state => {
      console.log('~~ Notifying from store about updateGrid')
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
    },
    updateDisplayFromStore({ commit }) {
      console.log('~~~ Updating GUI display')
      // commit('set', { key: 'isLoaded', value: boolValue })
      // if (this.state.grid !== Boolean(this.gridHelper)) {
      //   if (this.state.grid) {
      //     this.gridHelper = new THREE.GridHelper()
      //     this.axesHelper = new THREE.AxesHelper()
      //     this.axesHelper.renderOrder = 999
      //     this.axesHelper.onBeforeRender = renderer => renderer.clearDepth()
      //     this.scene.add(this.gridHelper)
      //     this.scene.add(this.axesHelper)
      //   } else {
      //     this.scene.remove(this.gridHelper)
      //     this.scene.remove(this.axesHelper)
      //     this.gridHelper = null
      //     this.axesHelper = null
      //     this.axesRenderer.clear()
      //   }
      // }
    }
  },
  modules: {}
})
