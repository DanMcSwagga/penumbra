import Vue from 'vue'
import Vuex from 'vuex'

import { sRGBEncoding, LinearEncoding } from 'three'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recordingIntervalID: null,
    isRecording: false,
    dateStartRecording: null,
    loggedState: [],

    showSpinner: false,
    showModelInfo: false,
    showTutorial: false,

    // File loading
    fileURL: '',
    rootPath: '',
    fileMap: null,
    fileType: '',

    // File history
    modelHistory: localStorage.modelHistory
      ? JSON.parse(localStorage.modelHistory)
      : [],

    // Loaded model information
    modelInfo: {},

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
    START_RECORDING: state => {
      state.isRecording = true
      state.dateStartRecording = Date.now()

      const { fileURL, sceneState, dateStartRecording } = state
      state.recordingIntervalID = setInterval(() => {
        state.loggedState.push({
          fileURL,
          sceneState,
          timeMs: Date.now() - dateStartRecording
        })
      }, 1000)
    },
    STOP_RECORDING: state => {
      state.isRecording = false

      clearInterval(state.recordingIntervalID)
      state.loggedState = []
    },

    SET: (state, { key, value }) => (state[key] = value),

    SET_SCENE_PROP: (state, { key, value }) => (state.sceneState[key] = value),

    TOGGLE_MODAL_MODEL_INFO: state => {
      state.showModelInfo = !state.showModelInfo
    },
    TOGGLE_MODAL_TUTORIAL: state => {
      state.showTutorial = !state.showTutorial
    },

    ACTIVATE_SPINNER: state => {
      state.showSpinner = true
    },
    DEACTIVATE_SPINNER: state => {
      state.showSpinner = false
    },

    SAVE_FILE_DATA: (state, { fileURL, rootPath, fileMap, fileType }) => {
      // TODO: create more elegant way of assigning these values
      // perhaps pass payload in arguments and then
      // Object.assign(state, payload) ?
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
    SAVE_MODEL_TO_HISTORY: (state, model) => {
      let history = state.modelHistory
      history.push(model)
      if (history.length > 20) {
        // trim localStorage model history up to 20 last
        history.shift()
        // history.splice(history.length - 20, 20)
      }
      localStorage.modelHistory = JSON.stringify(history)
    },

    SAVE_MODEL_INFO: (state, modelInfo) => {
      state.modelInfo = modelInfo
    },

    // GUI manipulations
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
    startRecording({ commit }) {
      console.log('⬤ STARTING RECORDING ⬤')
      commit('START_RECORDING')
    },
    stopRecording({ commit }) {
      console.log('◼ FINISHING RECORDING ◼')
      commit('STOP_RECORDING')
    },
    saveFileData({ commit }, fileData) {
      console.log('~~~ Saving file data to global state...')
      commit('SAVE_FILE_DATA', fileData)
    },
    resetFileData({ commit }) {
      console.log('~~~ Resetting file data to prepare for new model...')
      commit('RESET_FILE_DATA')
    },
    saveModelToHistory({ commit }, fileData) {
      console.log('~~~ Saving model to global state history...')
      console.dir(fileData)
      commit('SAVE_MODEL_TO_HISTORY', fileData)
    },
    saveModelInfo({ commit }, modelInfo) {
      console.log('~~~ Saving model info to global state...')
      commit('SAVE_MODEL_INFO', modelInfo)
    }
  },
  modules: {
    // TODO: separate File and GUI modules into separate ones
  }
})
