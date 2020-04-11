<template>
  <div class="scene-wrapper">
    <div id="scene" class="scene" :ref="'scene'"></div>
    <div id="axes" class="axes" :ref="'axes'"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { traversePrint, traverseMaterials } from '@/utils/traverse.js'
import { snakeCapsToCamel } from '@/utils/snakeCapsToCamel.js'
import * as loaders from '../../loaders'

import updateDisplay, { addAxesScene } from './Display'
import updateControls from './Controls'
import updateEnvironment from './Environment'
import updateEncoding from './Encoding'
import updateLighting from './Lighting'
import updateAnimation, {
  setClips,
  playClips,
  playAnimations
} from './Animation'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default {
  name: 'scene',

  computed: {
    ...mapState([
      'fileURL',
      'rootPath',
      'fileMap',
      'fileType',
      'foldersGUI',
      'sceneState'
    ])
  },

  // TODO: !!!IMPORTANT!!! Refactor everything regarding viewer
  // into its own Class and instantiate it here
  data() {
    return {
      defaultCamera: null,
      scene: null,
      renderer: null,
      controls: null,

      content: null,

      // Texture roughness values
      pmremGenerator: null,

      // Lighting
      lights: [],

      // Animation
      clips: null,
      mixer: null,
      animControls: [],
      clock: null,

      // Skeleton
      skeletonHelpers: [],

      // Grid
      gridHelper: null,

      // Axes
      axesHelper: null,
      axesRenderer: null,
      axesCamera: null,
      axesCorner: null,
      axesScene: null
    }
  },

  methods: {
    reset() {
      this.$refs['scene'].innerHTML = ''
      this.$refs['axes'].innerHTML = ''

      // Viewer resets | TODO: refactor everything into Viewer class
      this.clock = new THREE.Clock()
      this.lights = []
      this.gridHelper = null
      this.axesHelper = null
      this.content = null // TODO: needed??
    },

    init() {
      const el = this.$refs['scene']

      // Scene
      this.scene = new THREE.Scene()

      // Camera
      // const fov = options.preset === Preset.ASSET_GENERATOR ? (0.8 * 180) / Math.PI : 60
      this.defaultCamera = new THREE.PerspectiveCamera(
        60, // fov
        el.clientWidth / el.clientHeight,
        0.01,
        1000
      )
      this.scene.add(this.defaultCamera)

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.physicallyCorrectLights = true
      this.renderer.outputEncoding = this.sceneState.outputEncoding
      this.renderer.setClearColor(0xcccccc)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(el.clientWidth, el.clientHeight)
      // this.renderer.shadowMap.enabled = true //

      this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
      this.pmremGenerator.compileEquirectangularShader()

      // Controls
      this.updateControls()
      this.controls.screenSpacePanning = true // camera pans in screen space
      this.controls.autoRotate = this.sceneState.cameraAutoplay
      this.controls.autoRotateSpeed = -3

      el.appendChild(this.renderer.domElement)

      // TODO: create a separate component for the axisScene
      this.addAxesScene()

      // Resize resolution workaround
      // this.onWindowResize.bind(null, el),
      window.addEventListener('resize', this.onWindowResize, false)
    },

    animate() {
      requestAnimationFrame(this.animate)

      const delta = this.clock.getDelta()
      if (this.mixer) this.mixer.update(delta)

      this.render(delta)
    },

    render(delta) {
      this.renderer.render(this.scene, this.defaultCamera)

      // required if controls.enableDamping or controls.autoRotate are set to true
      if (this.controls.enabled) this.controls.update(delta)

      // Adds axisScene
      if (this.sceneState.axes) {
        this.axesCamera.position.copy(this.defaultCamera.position)
        this.axesCamera.lookAt(this.axesScene.position)
        this.axesRenderer.render(this.axesScene, this.axesCamera)
      }
    },

    onWindowResize() {
      // Main scene resize
      // const { clientWidth, clientHeight } = this.$refs['scene']
      const mainEl = this.$refs['scene']
      this.defaultCamera.aspect = mainEl.clientWidth / mainEl.clientHeight
      this.defaultCamera.updateProjectionMatrix()
      this.renderer.setSize(mainEl.clientWidth, mainEl.clientHeight)

      // // Axes scene resize
      // const axesEl = this.$refs['axes']
      // this.axesCamera.aspect = axesEl.clientWidth / axesEl.clientHeight
      // this.axesCamera.updateProjectionMatrix()
      // this.axesRenderer.setSize(axesEl.clientWidth, axesEl.clientHeight)

      // Controls
      this.controls.handleResize()
    },

    /**
     * object = Scene object
     */
    setContent(object, clips) {
      // TODO: Determine if needed
      // this.reset()

      // // Special check for STL objects
      // const box =
      //   this.fileType === 'stl'
      //     ? new THREE.Box3()
      //     : new THREE.Box3().setFromObject(object)
      const box = new THREE.Box3().setFromObject(object)
      const size = box.getSize(new THREE.Vector3()).length()
      const center = box.getCenter(new THREE.Vector3())

      // this.controls.reset()

      object.position.x += object.position.x - center.x
      object.position.y += object.position.y - center.y
      object.position.z += object.position.z - center.z

      // this.controls.maxDistance = size * 10

      this.defaultCamera.near = size / 1000 // 100
      this.defaultCamera.far = size * 1000 // 100
      this.defaultCamera.updateProjectionMatrix()

      // if (this.options.cameraPosition) {
      // this.defaultCamera.position.fromArray(this.options.cameraPosition)
      // this.defaultCamera.lookAt(new THREE.Vector3())
      // } else {
      this.defaultCamera.position.copy(center)
      this.defaultCamera.position.x += size / 2.0
      this.defaultCamera.position.y += size / 5.0
      this.defaultCamera.position.z += size / 2.0
      this.defaultCamera.lookAt(center)
      // }

      // this.setCamera()

      // AxesHelper
      this.axesCamera.position.copy(this.defaultCamera.position)
      this.axesCamera.lookAt(this.axesScene.position)
      this.axesCamera.near = size / 100
      this.axesCamera.far = size * 100
      this.axesCamera.updateProjectionMatrix()
      this.axesCorner.scale.set(size, size, size)

      // this.controls.saveState()
      // object.scale = new THREE.Vector3(100, 100, 100)

      this.scene.add(object)
      this.content = object

      this.$store.commit('SET', { disableLighting: false })

      this.content.traverse(node => {
        if (node.isMesh) {
          node.material.depthWrite = !node.material.transparent
        } else if (node.isLight) {
          this.$store.commit('SET', { disableLighting: true })
        }
      })

      //

      this.updateLighting()
      this.updateEncoding()
      this.updateDisplay()
      this.updateAnimation()
      this.updateEnvironment()

      this.setClips(clips)
      this.resetGUI()

      // TODO: figure out what this is for
      // TODO: rename this.content to this.sceneInfo
      window.content = this.content
      console.info('THREE.Scene exported as `window.content`')
      // console.dir(this.content)
      traversePrint(this.content)
    },

    setClips(clips) {
      setClips(this.$data, clips)
    },

    playClips() {
      playClips(this.$data)
    },

    resetGUI() {
      this.animControls.forEach(ctrl => ctrl.remove())
      this.animControls.length = 0

      // -- Don't display the animation folder
      // ...

      // Animations playout
      if (this.clips.length) {
        // -- Display the animation folder
        // Get the folder classlist
        // Remove no-display from it
        // Commit changes to store
        // ...

        // Play the animations
        playAnimations(this.$data)

        // Use animation folder to play other clips when enabled
        // playOtherClips()
        // (Also, dont forget to add animCtrls to this.$data)
      }
    },

    updateEnvironment() {
      updateEnvironment(this.$data, this.sceneState, this.$store)
    },

    updateAnimation() {
      updateAnimation(this.$data, this.sceneState)
    },

    resetGUIFolders() {
      // TODO: create a global store's attribute whether to display animFolder
      this.$store.commit('SET_FOLDER_GUI_DISPLAY', { anim: 'none' })
    },

    loadModel() {
      let loaderPromise

      switch (this.fileType) {
        case 'gltf':
          loaderPromise = loaders.loadGLTF(this)
          break
        case 'glb':
          loaderPromise = loaders.loadGLTF(this)
          break
        case 'fbx':
          loaderPromise = loaders.loadFBX(this)
          break
        case 'obj':
          loaderPromise = loaders.loadOBJ(this)
          break
        case 'dae':
          loaderPromise = loaders.loadDAE(this)
          break
        case 'stl':
          loaderPromise = loaders.loadSTL(this)
          break

        default:
          console.error('Unable to load the model')
          break
      }

      return loaderPromise
    },

    addAxesScene() {
      addAxesScene(this.$data, this.$refs['axes'])
    },

    updateDisplay() {
      updateDisplay(this.$data, this.sceneState)
    },

    updateCamera() {
      this.controls.autoRotate = this.sceneState.cameraAutoplay
    },

    updateControls() {
      updateControls(this.$data, this.sceneState)
    },

    updateEncoding() {
      updateEncoding(this.$data, this.sceneState)
    },

    resetLighting() {
      localStorage.clear() // TODO: Temporary, remove later
      this.$store.commit('SET_DEFAULT_LIGHTING')
      this.updateLighting()
    },

    updateLighting() {
      updateLighting(this.$data, this.sceneState)
    }
  },

  watch: {
    fileURL: function() {
      // Initiate the scene
      this.reset()
      this.init()
      this.animate()

      // TODO: figure out how to deactivate spinner if wrong input

      // Same as viewer.load().catch().then()
      this.loadModel()
        // On Error handler (should be same as in Viewer's onError)
        .catch(error => {
          console.log('in error')
          let message = (error || {}).message || error.toString()
          window.alert(message)
          console.error(error)
        })
        // Then Handler
        .then(object => {
          console.log('in cleanup')
          // Cleanup
          this.$store.commit('DEACTIVATE_SPINNER')
          if (typeof this.rootFile === 'object')
            URL.revokeObjectURL(this.fileURL)
        })
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      // console.log(`Reacting to ${mutation.type} mutation`)

      // Assign only certain types of mutations, ALLOW pitfall
      switch (mutation.type) {
        case 'UPDATE_DISPLAY':
        case 'UPDATE_ENVIRONMENT':
        case 'UPDATE_CAMERA':
        case 'UPDATE_CONTROLS':
        case 'UPDATE_LIGHTING':
        case 'RESET_LIGHTING':
        case 'UPDATE_ENCODING':
        case 'UPDATE_ANIMATION':
        case 'PLAY_CLIPS':
          // console.log(`Reacting to ${mutation.type} mutation`)

          this[snakeCapsToCamel(mutation.type)]()
          break

        default:
          break
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.scene {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
}

.axes {
  width: 100px;
  height: 100px;
  margin: 20px;
  padding: 0px;
  position: absolute;
  left: 0px;
  bottom: 0px;
  z-index: 10;
  pointer-events: none;
}
</style>
