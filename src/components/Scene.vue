<template>
  <div class="scene-wrapper">
    <div id="scene" class="scene" :ref="'scene'"></div>
    <div id="axes" class="axes" :ref="'axes'"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { traversePrint } from '@/utils/utils'

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
    ...mapState(['fileURL', 'rootPath', 'fileMap', 'sceneState'])
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

      clock: null,
      // pmremGenerator: null // texture roughness values

      // Lighting
      lights: [],

      // Animation
      clips: null,
      mixer: null,
      animControls: [],

      // Skeleton
      skeletonHelpers: [],

      // Grid
      gridHelper: null,

      // Axes
      axesHelper: null,
      axesRenderer: null,
      axesCamera: null,
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
      this.content = null // TODO: needed??
    },

    // initState() {
    //   this.localState = {
    //     grid: false
    //   }
    // },

    init() {
      // const el = document.getElementById('scene')
      const el = this.$refs['scene']

      // Scene
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xa0a0a0)

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
      this.renderer.setPixelRatio(window.devicePixelRatio) //
      this.renderer.setSize(el.clientWidth, el.clientHeight)
      // this.renderer.shadowMap.enabled = true //

      // this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
      // this.pmremGenerator.compileEquirectangularShader()

      // Controls
      this.updateControls()
      this.controls.screenSpacePanning = true // camera pans in screen space
      this.controls.autoRotate = this.sceneState.cameraAutoplay
      this.controls.autoRotateSpeed = -3

      el.appendChild(this.renderer.domElement)

      // TODO: create a separate component for the axisScene
      this.addAxesScene()

      requestAnimationFrame(this.animate) // TODO: needed ?

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
      if (this.sceneState.grid) {
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
      // this.controls.handleResize() // TODO: learn what thats for
    },

    /**
     * object = Scene object
     */
    setContent(object, clips) {
      // TODO: Determine if needed
      // this.reset()

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

      this.$store.commit('set', { disableLighting: false })

      this.content.traverse(node => {
        if (node.isMesh) {
          node.material.depthWrite = !node.material.transparent
        } else if (node.isLight) {
          this.$store.commit('set', { disableLighting: true })
        }
      })

      //

      this.updateLighting()
      this.updateEncoding()
      this.updateDisplay()

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
      if (this.mixer) {
        this.mixer.stopAllAction()
        this.mixer.uncacheRoot(this.mixer.getRoot())
        this.mixer = null
      }

      this.clips = clips
      if (!clips.length) return

      this.mixer = new THREE.AnimationMixer(this.content)
    },

    playClips() {
      this.clips.forEach(clip => {
        this.mixer
          .clipAction(clip)
          .reset()
          .play()
        // this.state.actionStates[clip.name] = true
      })
    },

    resetGUI() {
      this.animControls.forEach(ctrl => ctrl.remove())
      this.animControls.length = 0
      // TODO: create a global store's attribute whether to display animFolder
      // this.animFolder.domElement.style.display = 'none'

      // Animations playout
      if (this.clips.length) {
        // this.animFolder.domElement.style.display = ''
        // const actionStates = (this.state.actionStates = {})
        this.clips.forEach((clip, clipIndex) => {
          // Autoplay the first clip.
          let action
          // if (clipIndex === 0) {
          // actionStates[clip.name] = true
          action = this.mixer.clipAction(clip)
          action.play()
          // } else {
          // actionStates[clip.name] = false
          // }

          // // Play other clips when enabled.
          // const ctrl = this.animFolder.add(actionStates, clip.name).listen()
          // ctrl.onChange(playAnimation => {
          //   action = action || this.mixer.clipAction(clip)
          //   action.setEffectiveTimeScale(1)
          //   playAnimation ? action.play() : action.stop()
          // })
          // this.animCtrls.push(ctrl)
        })
      }
    },

    updateAnimation() {
      console.log('speed in update animation: ', this.sceneState.playbackSpeed)
      if (this.mixer) this.mixer.timeScale = this.sceneState.playbackSpeed
    },

    // TODO: deep-learn about loaders, managers, draco etc,
    // understand what setURLModifier does
    loadModelFBX() {
      const baseURL = THREE.LoaderUtils.extractUrlBase(this.fileURL)

      // Load
      return new Promise((resolve, reject) => {
        const loader = new FBXLoader()
        loader.setCrossOrigin('anonymous')

        const blobURLs = []

        loader.load(
          this.fileURL,
          object => {
            // const scene = object.scene || object.scenes[0]
            // const clips = object.animations || []

            // !!! IMPORTANT: special handling for animations in FBX
            // // Animation
            // mixer = new THREE.AnimationMixer(object)
            // let action = mixer.clipAction(object.animations[0])
            // action.play()

            object.traverse(child => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })

            this.setContent(object, [])

            blobURLs.forEach(URL.revokeObjectURL)

            resolve(object)
          },
          undefined,
          reject
        )
      })
    },

    // Loading from file (GLTF)
    loadModel() {
      // TODO: Only load needed THREE components manually

      // e.g. in dev mode it is always http://localhost:8080/
      const baseURL = THREE.LoaderUtils.extractUrlBase(this.fileURL)

      // Load
      return new Promise((resolve, reject) => {
        const manager = new THREE.LoadingManager()

        // Intercept and override relative URLs.
        manager.setURLModifier((url, path) => {
          const normalizedURL =
            this.rootPath + url.replace(baseURL, '').replace(/^(\.?\/)/, '')

          if (this.fileMap.has(normalizedURL)) {
            const blob = this.fileMap.get(normalizedURL)
            const blobURL = URL.createObjectURL(blob)
            blobURLs.push(blobURL)
            return blobURL
          }

          // console.log('in scene.load manager URL Modifier, returning:');
          // console.dir((path || '') + url)
          return (path || '') + url
        })

        // TODO: need to determine which constructor to use here
        // using information caught by Viewer regarding type
        // e.g., loader = determineLoader(type, manager = default)
        const loader = new GLTFLoader(manager)
        loader.setCrossOrigin('anonymous')

        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        // const dracoLoader = new DRACOLoader()
        // dracoLoader.setDecoderPath('assets/draco/') // TODO: change
        // loader.setDRACOLoader(dracoLoader)

        const blobURLs = []

        loader.load(
          this.fileURL,
          // called when the resource is loaded
          gltf => {
            const scene = gltf.scene || gltf.scenes[0]
            const clips = gltf.animations || []
            // gltf.animations // Array<THREE.AnimationClip>
            // gltf.scene // THREE.Scene
            // gltf.scenes // Array<THREE.Scene>
            // gltf.cameras // Array<THREE.Camera>
            // gltf.asset // Object

            // TODO: thoroughly check this function
            this.setContent(scene, clips)

            blobURLs.forEach(URL.revokeObjectURL)

            // See: https://github.com/google/draco/issues/349
            // DRACOLoader.releaseDecoderModule();

            resolve(gltf)
          },
          // onProgress
          xhr => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
          // onError
          reject
        )
      })
    },

    addAxesScene() {
      const axesElement = this.$refs['axes']
      const { clientWidth, clientHeight } = axesElement

      this.axesScene = new THREE.Scene()
      this.axesCamera = new THREE.PerspectiveCamera(
        50,
        clientWidth / clientHeight,
        0.1,
        10
      )
      this.axesScene.add(this.axesCamera)

      this.axesRenderer = new THREE.WebGLRenderer({ alpha: true })
      this.axesRenderer.setPixelRatio(window.devicePixelRatio)
      this.axesRenderer.setSize(clientWidth, clientHeight)

      this.axesCamera.up = this.defaultCamera.up

      this.axesCorner = new THREE.AxesHelper(5)
      this.axesScene.add(this.axesCorner)
      axesElement.appendChild(this.axesRenderer.domElement)
    },

    updateDisplay() {
      // Remove skeleton geometry if present
      if (this.skeletonHelpers.length) {
        this.skeletonHelpers.forEach(helper => this.scene.remove(helper))
      }

      // Add all wireframe data to the viewer content
      // material: MeshStandardMaterial (has opacity, color, etc)
      // TODO: think of ways of controlling wireframes from GUI (Sketchfab)
      this.traverseMaterials(this.content, material => {
        // console.dir(material)
        material.wireframe = this.sceneState.wireframe
      })

      // Form the skeleton base and add it to the scene
      this.content.traverse(node => {
        if (node.isMesh && node.skeleton && this.sceneState.skeleton) {
          const helper = new THREE.SkeletonHelper(node.skeleton.bones[0].parent)
          // Due to limitations of the OpenGL Core Profile with
          // the WebGL renderer on most platforms linewidth will always be 1
          // regardless of the set value.
          // helper.material.linewidth = 5 // still is 1

          this.scene.add(helper)
          this.skeletonHelpers.push(helper)
        }
      })

      // TODO: separate axesScene/Helper and gridHelper
      if (this.sceneState.grid !== Boolean(this.gridHelper)) {
        if (this.sceneState.grid) {
          this.gridHelper = new THREE.GridHelper()
          // TODO: add following as an option to GUI
          // this.gridHelper.material.transparent = true
          this.axesHelper = new THREE.AxesHelper()
          this.axesHelper.renderOrder = 999
          this.axesHelper.onBeforeRender = renderer => renderer.clearDepth()
          this.scene.add(this.gridHelper)
          this.scene.add(this.axesHelper)
        } else {
          this.scene.remove(this.gridHelper)
          this.scene.remove(this.axesHelper)
          this.gridHelper = null
          this.axesHelper = null
          this.axesRenderer.clear()
        }
      }
    },

    updateCamera() {
      this.controls.autoRotate = this.sceneState.cameraAutoplay
    },

    updateControls() {
      if (this.controls) this.controls.dispose()
      if (this.sceneState.fpsControls) {
        // this.controls = new PointerLockControls(
        //   this.defaultCamera,
        //   this.renderer.domElement
        // )
        // console.dir(this.controls)
        this.controls = new FirstPersonControls(
          this.defaultCamera,
          this.renderer.domElement
        )
        this.controls.movementSpeed = 10
        this.controls.lookSpeed = 0.1
      } else {
        this.controls = new OrbitControls(
          this.defaultCamera,
          this.renderer.domElement
        )
      }
    },

    // TODO: Separate output and texture encodings
    // updateEncoding() {
    //   const outEnc = this.sceneState.outputEncoding
    //   const textEnc = this.sceneState.textureEncoding

    //   // outputEncoding is an Enum of TextureEncodings
    //   this.renderer.outputEncoding = Number(outEnc)
    //   this.traverseMaterials(this.content, material => {
    //     material.needsUpdate = true
    //   })

    //   // textureEncoding
    //   this.traverseMaterials(this.content, material => {
    //     if (material.map) material.map.encoding = Number(textEnc)
    //     if (material.emissiveMap)
    //       material.emissiveMap.encoding = Number(textEnc)
    //     if (material.map || material.emissiveMap) material.needsUpdate = true
    //   })
    // },

    updateEncoding() {
      const outEncEnum = Number(this.sceneState.outputEncoding)
      const textEncEnum = Number(this.sceneState.textureEncoding)

      this.renderer.outputEncoding = outEncEnum
      this.traverseMaterials(this.content, material => {
        if (material.map) material.map.encoding = textEncEnum
        if (material.emissiveMap) material.emissiveMap.encoding = textEncEnum
        if (material.map || material.emissiveMap) material.needsUpdate = true
      })
    },

    resetLighting() {
      this.$store.commit('setDefaultLighting')
      this.updateLighting()
    },

    updateLighting() {
      const scst = this.sceneState
      const lits = this.lights

      const addLighting = () => {
        // const lightHemi = new THREE.HemisphereLight();

        const lightAmbient = new THREE.AmbientLight(
          scst.ambientColor,
          scst.ambientIntensity
        )
        lightAmbient.name = 'ambient_light'

        const lightDirectional = new THREE.DirectionalLight(
          scst.directColor,
          scst.directIntensity
        )
        lightDirectional.position.set(0.5, 0, 0.866) // appx. 60 degrees
        lightDirectional.name = 'directional_light'

        this.defaultCamera.add(lightAmbient, lightDirectional)
        lits.push(lightAmbient, lightDirectional)
      }

      const removeLighting = () => {
        lits.forEach(light => light.parent.remove(light))
        lits.length = 0
      }

      const applyLighting = () => {
        lits[0].color.setHex(scst.ambientColor) // ambient
        lits[0].intensity = scst.ambientIntensity
        lits[1].color.setHex(scst.directColor) // directional
        lits[1].intensity = scst.directIntensity
      }

      // Lighting control
      if (!scst.disableLighting && !lits.length) {
        addLighting()
      } else if (scst.disableLighting && lits.length) {
        removeLighting()
      }

      // Exposure
      this.renderer.toneMappingExposure = this.sceneState.exposure

      // Default lighting
      if (lits.length === 2) {
        applyLighting()
      }
    },

    traverseMaterials(object, callback) {
      object.traverse(node => {
        if (!node.isMesh) return
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material]
        materials.forEach(callback)
      })
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
        .then(gltf => {
          console.log('in cleanup')
          // Cleanup
          this.$store.commit('deactivateSpinner')
          if (typeof this.rootFile === 'object')
            URL.revokeObjectURL(this.fileURL)
        })
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      // console.log(`Reacting to ${mutation.type} mutation`)

      // Assigning only certain types of mutations
      switch (mutation.type) {
        case 'updateDisplay':
        case 'updateCamera':
        case 'updateControls':
        case 'updateLighting':
        case 'updateEncoding':
        case 'updateAnimation':
        case 'playClips':
        case 'resetLighting':
          this[mutation.type]()
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
