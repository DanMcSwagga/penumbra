<template>
  <div id="viewer" class="viewer" ref="viewer">
    <main class="uploader-wrapper">
      <ViewerHeader />
      <FileUpload />
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import FileUpload from '@/components/FileUpload.vue'
import ViewerHeader from '@/components/ViewerHeader.vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default {
  name: 'viewer',

  components: {
    ViewerHeader,
    FileUpload
  },

  computed: {
    ...mapState(['fileURL', 'rootPath', 'fileMap'])
  },

  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      light: null,

      controls: null,

      clock: null,
      mixer: null,

      objectURL: '/static/elephant_lowpoly.fbx'
    }
  },

  methods: {
    logData() {
      console.log('logging this.data')
      console.dir(this.$data)
      console.log('logging file data')
      console.dir(this.fileData)
    },

    init() {
      const el = document.getElementById('viewer')
      this.camera = new THREE.PerspectiveCamera(
        70,
        el.clientWidth / el.clientHeight,
        0.1,
        1000
      )
      this.camera.position.set(100, 200, 300)

      // Scene and Lighting
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xa0a0a0)
      this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000)

      this.light = new THREE.HemisphereLight(0xffffff, 0x444444)
      this.light.position.set(0, 200, 0)
      this.scene.add(this.light)

      this.light = new THREE.DirectionalLight(0xffffff)
      this.light.position.set(0, 200, 100)
      this.light.castShadow = true
      this.light.shadow.camera.top = 180
      this.light.shadow.camera.bottom = -100
      this.light.shadow.camera.left = -120
      this.light.shadow.camera.right = 120
      this.scene.add(this.light)

      // Ground
      let mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
      )
      mesh.rotation.x = -Math.PI / 2
      mesh.receiveShadow = true
      this.scene.add(mesh)

      let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000)
      grid.material.opacity = 0.2
      grid.material.transparent = true
      this.scene.add(grid)

      // // model
      // let loader = new FBXLoader()
      // loader.load(
      //   this.objectURL,
      //   object => {
      //     this.mixer = new THREE.AnimationMixer(object)

      //     let action = this.mixer.clipAction(object.animations[0])
      //     action.play()

      //     object.traverse(child => {
      //       if (child.isMesh) {
      //         child.castShadow = true
      //         child.receiveShadow = true
      //       }
      //     })
      //     console.log('logging object')
      //     console.dir({ object })

      //     this.scene.add(object)
      //   },
      //   progressmsg => {
      //     console.log('>>> On progress load handler:')
      //     console.log(progressmsg)
      //   },
      //   error => {
      //     console.log('>>> On error load handler:')
      //     console.log(error)
      //   }
      // )

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio) //
      this.renderer.setSize(el.clientWidth, el.clientHeight)
      this.renderer.shadowMap.enabled = true //
      el.appendChild(this.renderer.domElement)

      // Controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.target.set(0, 100, 0)
      this.controls.update()

      // Resize resolution workaround
      el.addEventListener('resize', this.onWindowResize.bind(null, el), false)
    },

    onWindowResize(window) {
      this.camera.aspect = window.clientWidth / window.clientHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.clientWidth, window.clientHeight)
    },

    animate() {
      requestAnimationFrame(this.animate)

      let delta = this.clock.getDelta()
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

    // Loading from file
    loadModel() {
      console.log('in viewer.load:')
      console.dir(this.fileURL)
      console.dir(this.rootPath)
      console.dir(this.fileMap)

      // TODO: Only load needed THREE components manually
      const baseURL = THREE.LoaderUtils.extractUrlBase(this.fileURL)
      console.log('in viewer.load baseURL:', baseURL)

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

          // console.log('in viewer.load manager URL Modifier, returning:');
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

            console.log('in viewer.load blobURLs:')
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

      this.camera.near = size / 100
      this.camera.far = size * 100
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

      // this.setCamera(DEFAULT_CAMERA)

      // this.axesCamera.position.copy(this.camera.position)
      // this.axesCamera.lookAt(this.axesScene.position)
      // this.axesCamera.near = size / 100
      // this.axesCamera.far = size * 100
      // this.axesCamera.updateProjectionMatrix()
      // this.axesCorner.scale.set(size, size, size)

      // this.controls.saveState()

      this.scene.add(object)
    }
  },

  watch: {
    // TODO: isLoaded even needed??

    fileURL: function() {
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
.viewer {
  width: 100vw;
  height: 100vh;
}

.uploader-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  flex-grow: 1;
  position: relative;
}
</style>
