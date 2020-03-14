import Vue from 'vue'
import Vuex from 'vuex'

import { sRGBEncoding, LinearEncoding } from 'three'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showSpinner: false,

    // File loading
    fileURL: '',
    rootPath: '',
    fileMap: {},
    fileType: '',

    // File history
    modelHistory: [],

    // Visibility control for specific GUI folders
    foldersGUI: {
      // anim: 'no-display'
      anim: null
    },

    // GUI variables
    sceneState: {
      // Interaction
      fpsControls: false,
      cameraAutoplay: false,

      // Display
      grid: false,
      axes: false,
      wireframe: false,
      skeleton: false,

      // Environment
      background: false,
      environment: 'None',

      // Animation
      playbackSpeed: 1.0,
      // actionStates: {},

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
    SET: (state, { key, value }) => (state[key] = value),

    SET_SCENE_PROP: (state, { key, value }) => (state.sceneState[key] = value),

    ACTIVATE_SPINNER: state => {
      state.showSpinner = true
    },
    DEACTIVATE_SPINNER: state => {
      state.showSpinner = false
    },

    SAVE_FILE_DATA: (state, { fileURL, rootPath, fileMap, fileType }) => {
      // TODO: create more elegant way of assigning these values
      state.fileURL = fileURL
      state.rootPath = rootPath
      state.fileMap = fileMap
      state.fileType = fileType
    },
    RESET_FILE_DATA: state => {
      state.fileURL = ''
      state.rootPath = ''
      state.fileMap = null
      state.fileType = ''
    },
    ADD_MODEL_TO_HISTORY: (state, model) => {
      state.modelHistory.push(model)
    },

    SET_DEFAULT_LIGHTING: state => {
      // TODO: extract to separate default constant
      state.sceneState.ambientColor = 0xffffff
      state.sceneState.directColor = 0xffffff
      state.sceneState.ambientIntensity = 0.4
      state.sceneState.directIntensity = 0.8 * Math.PI
      state.sceneState.exposure = 1.0
    },

    UPDATE_CAMERA: () => console.log('~~ updateCamera notifier'),

    // UPDATE_CAMERA: () => {},
    UPDATE_CONTROLS: () => {},
    UPDATE_DISPLAY: () => {},
    UPDATE_ENVIRONMENT: () => {},
    PLAY_CLIPS: () => {},
    UPDATE_ANIMATION: (state, speed) => (state.playbackSpeed = speed),
    UPDATE_LIGHTING: () => {},
    RESET_LIGHTING: () => {},
    UPDATE_ENCODING: () => {}
  },

  actions: {
    saveFileData({ commit }, fileData) {
      console.log('~~~ Saving file data to global state...')
      // console.dir(fileData)
      commit('SAVE_FILE_DATA', fileData)
    },
    resetFileData({ commit }) {
      console.log('~~~ Resetting file data to prepare for new model...')
      commit('RESET_FILE_DATA')
    },
    addModelToHistory({ commit }, fileData) {
      console.log('~~~ Saving file data to global state...')
      console.dir(fileData)
      commit('ADD_MODEL_TO_HISTORY', fileData)
    }
  },
  modules: {}
})
