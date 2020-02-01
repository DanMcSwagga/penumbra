<template>
  <div class="scene-wrapper">
    <div id="scene" class="scene" :ref="'scene'"></div>
    <div id="axes" class="axes" :ref="'axes'"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

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
      lights: [],
      controls: null,

      content: null,

      clock: null,
      // mixer: null // animations
      // pmremGenerator: null // texture roughness values

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
      this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000)

      // Lighting
      let light = new THREE.HemisphereLight(0xffffff, 0x444444)
      light.position.set(0, 200, 0)
      this.lights.push(light)
      // this.scene.add(light)

      light = new THREE.DirectionalLight(0xffffff)
      light.position.set(0, 200, 100)
      light.castShadow = true
      light.shadow.camera.top = 180
      light.shadow.camera.bottom = -100
      light.shadow.camera.left = -120
      light.shadow.camera.right = 120
      this.lights.push(light)
      // this.scene.add(light)
      this.scene.add(...this.lights)

      // // Ground
      // let mesh = new THREE.Mesh(
      //   new THREE.PlaneBufferGeometry(2000, 2000),
      //   new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
      // )
      // mesh.rotation.x = -Math.PI / 2
      // mesh.receiveShadow = true
      // this.scene.add(mesh)

      // Camera
      // const fov = options.preset === Preset.ASSET_GENERATOR ? (0.8 * 180) / Math.PI : 60
      this.defaultCamera = new THREE.PerspectiveCamera(
        60, // fov
        el.clientWidth / el.clientHeight,
        0.01,
        1000
      )

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      // // TODO: Needed or nah?
      // this.renderer.physicallyCorrectLights = true
      // this.renderer.outputEncoding = THREE.sRGBEncoding
      this.renderer.setClearColor(0xcccccc)
      this.renderer.setPixelRatio(window.devicePixelRatio) //
      this.renderer.setSize(el.clientWidth, el.clientHeight)
      // this.renderer.shadowMap.enabled = true //

      // this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
      // this.pmremGenerator.compileEquirectangularShader()

      // // Controls
      // this.controls = new OrbitControls(
      //   this.defaultCamera,
      //   this.renderer.domElement
      // )
      this.updateControls()
      // // TODO: optional - auto rotation using controls
      // this.controls.autoRotate = false
      // this.controls.autoRotateSpeed = -5
      // this.controls.screenSpacePanning = true

      el.appendChild(this.renderer.domElement)

      //
      // TODO: create a separate component for the axisScene
      this.addAxesScene()

      requestAnimationFrame(this.animate) // TODO: needed ?

      // Resize resolution workaround
      // this.onWindowResize.bind(null, el),
      window.addEventListener('resize', this.onWindowResize, false)
    },

    animate() {
      requestAnimationFrame(this.animate)

      this.render()
    },

    render() {
      this.renderer.render(this.scene, this.defaultCamera)

      // required if controls.enableDamping or controls.autoRotate are set to true
      // this.controls.update(this.clock.getDelta())
      if (this.controls.enabled) this.controls.update(this.clock.getDelta())

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

        const loader = new GLTFLoader(manager)
        loader.setCrossOrigin('anonymous')

        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('assets/draco/')
        loader.setDRACOLoader(dracoLoader)

        const blobURLs = []

        loader.load(
          this.fileURL,
          // called when the resource is loaded
          gltf => {
            const scene = gltf.scene || gltf.scenes[0]
            const clips = gltf.animations || []

            // TODO: thoroughly check this function
            this.setContent(scene, clips)

            blobURLs.forEach(URL.revokeObjectURL)

            // See: https://github.com/google/draco/issues/349
            // DRACOLoader.releaseDecoderModule();

            resolve(gltf)
          },
          undefined, // onProgress
          reject // onError
        )
      })
    },

    /**
     * object = Scene object
     */
    setContent(object, clips) {
      // this.clear();

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

      this.content.traverse(node => {
        if (node.isMesh) {
          node.material.depthWrite = !node.material.transparent
        } else if (node.isLight) {
          this.state.addLights = false
        }
      })

      //

      this.updateDisplay()
      // this.updateControls()
      // // Controls
      // this.controls = new OrbitControls(
      //   this.defaultCamera,
      //   this.renderer.domElement
      // )
      //

      // TODO: figure out what this is for
      // window.content = this.content
      // console.info('[glTF Viewer] THREE.Scene exported as `window.content`.')
      // this.printGraph(this.content)
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
      this.traverseMaterials(this.content, material => {
        material.wireframe = this.sceneState.wireframe
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
      console.log('Watching for a fileURL change...')

      // Initiate the scene
      this.reset()
      this.init()
      this.animate()

      // Same as viewer.load().catch().then()
      this.loadModel()
        // On Error handler (should be same as in Viewer's onError)
        .catch(error => {
          let message = (error || {}).message || error.toString()
          window.alert(message)
          console.error(error)
        })
        // Then Handler
        .then(gltf => {
          // Cleanup
          this.$store.commit('deactivateSpinner')
          if (typeof this.rootFile === 'object')
            URL.revokeObjectURL(this.fileURL)
        })
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'updateDisplay') {
        console.log(`Reacting to Display Update`)
        this.updateDisplay()
      } else if (mutation.type === 'updateControls') {
        console.log(`Reacting to Controls Update`)
        this.updateControls()
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
