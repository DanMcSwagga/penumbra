<template>
  <div id="scene" class="scene" :ref="'scene'"></div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default {
  name: 'scene',

  computed: {
    ...mapState(['fileURL', 'rootPath', 'fileMap'])
  },

  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      lights: [],

      controls: null,
      content: null,

      clock: null,
      mixer: null

      // pmremGenerator: null
    }
  },

  methods: {
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

      // Grid
      let grid = new THREE.GridHelper(20, 20, 0x000000, 0x000000)
      grid.material.opacity = 0.2
      grid.material.transparent = true
      this.scene.add(grid)

      // Camera
      // const fov = options.preset === Preset.ASSET_GENERATOR ? (0.8 * 180) / Math.PI : 60
      this.camera = new THREE.PerspectiveCamera(
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

      // // TODO: PmremGenerator | Texture roughness values
      // this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
      // this.pmremGenerator.compileEquirectangularShader()

      // Controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // // TODO: optional - auto rotation using controls
      // this.controls.autoRotate = false
      // this.controls.autoRotateSpeed = -5
      // this.controls.screenSpacePanning = true

      el.appendChild(this.renderer.domElement)

      //

      requestAnimationFrame(this.animate) // TODO: needed ?

      // Resize resolution workaround
      el.addEventListener('resize', this.onWindowResize.bind(null, el), false)
    },

    animate() {
      requestAnimationFrame(this.animate)

      const delta = this.clock.getDelta()

      this.controls.update()
      if (this.mixer) this.mixer.update(delta)

      // this.renderer.render(this.scene, this.camera)
      this.render()
    },

    render() {
      this.renderer.render(this.scene, this.camera)
      // if (this.state.grid) {
      //   this.axesCamera.position.copy(this.defaultCamera.position)
      //   this.axesCamera.lookAt(this.axesScene.position)
      //   this.axesRenderer.render( this.axesScene, this.axesCamera );
      // }
    },

    onWindowResize(window) {
      this.camera.aspect = window.clientWidth / window.clientHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.clientWidth, window.clientHeight)
    },

    // Loading from file
    loadModel() {
      console.log('in scene.load:')
      console.dir(this.fileURL)
      console.dir(this.rootPath)
      console.dir(this.fileMap)

      // TODO: Only load needed THREE components manually
      const baseURL = THREE.LoaderUtils.extractUrlBase(this.fileURL)
      console.log('in scene.load baseURL:', baseURL)

      // Load
      // return new Promise((resolve, reject) => {
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

            console.log('in scene.load blobURLs:')
            console.dir(blobURLs)
            blobURLs.forEach(URL.revokeObjectURL)

            // See: https://github.com/google/draco/issues/349
            // DRACOLoader.releaseDecoderModule();

            resolve(gltf)
          },
          undefined,
          reject
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

      console.log('in setContent:')
      console.dir(object)
      console.dir(object.children[0])
      console.dir(this.camera)

      // this.controls.reset()

      object.position.x += object.position.x - center.x
      object.position.y += object.position.y - center.y
      object.position.z += object.position.z - center.z

      // this.controls.maxDistance = size * 10

      this.camera.near = size / 1000 // 100
      this.camera.far = size * 1000 // 100
      this.camera.updateProjectionMatrix()

      // if (this.options.cameraPosition) {
      // this.camera.position.fromArray(this.options.cameraPosition)
      // this.camera.lookAt(new THREE.Vector3())
      // } else {
      this.camera.position.copy(center)
      this.camera.position.x += size / 2.0
      this.camera.position.y += size / 5.0
      this.camera.position.z += size / 2.0
      this.camera.lookAt(center)
      // }

      // this.setCamera()

      // this.axesCamera.position.copy(this.camera.position)
      // this.axesCamera.lookAt(this.axesScene.position)
      // this.axesCamera.near = size / 100
      // this.axesCamera.far = size * 100
      // this.axesCamera.updateProjectionMatrix()
      // this.axesCorner.scale.set(size, size, size)

      // this.controls.saveState()
      // object.scale = new THREE.Vector3(100, 100, 100)

      this.scene.add(object)
      this.content = object
    }
  },

  watch: {
    // TODO: isLoaded even needed??

    // TODO: move Load() from Viewer to store ??

    fileURL: function() {
      console.log('WATCING IN WATCH')
      this.clock = new THREE.Clock()
      this.init()
      this.animate()

      this.loadModel()
        // On Error handler
        .catch(error => {
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
        })
        // Then Handler
        .then(gltf => {
          // Cleanup
          this.$store.commit('deactivateSpinner')
          if (typeof this.rootFile === 'object')
            URL.revokeObjectURL(this.fileURL)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.scene {
  display: flex;
  flex-direction: column; // TODO: rethink later
  // width: 100vw;
  // flex-grow: 1;
  position: relative;
  // TODO
  width: 100%;
  height: 100%;
}
</style>
