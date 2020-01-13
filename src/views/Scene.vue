<template>
  <div id="scene" class="scene" ref="scene"></div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'scene',

  data() {
    return {
      camera: null,
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      mesh: null
    }
  },

  methods: {
    init() {
      const el = document.getElementById('scene')
      this.camera = new THREE.PerspectiveCamera(
        70,
        el.clientWidth / el.clientHeight,
        0.1,
        1000
      )
      this.camera.position.z = 5

      this.renderer.setSize(el.clientWidth, el.clientHeight)
      el.appendChild(this.renderer.domElement)

      this.scene = new THREE.Scene()

      let geometry = new THREE.BoxGeometry(1, 1, 1)
      let material = new THREE.MeshNormalMaterial()
      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)
    },

    animate() {
      requestAnimationFrame(this.animate)

      this.mesh.rotation.x += 0.01
      this.mesh.rotation.y += 0.02

      this.renderer.render(this.scene, this.camera)
    }
  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>

<style scoped>
.scene {
  width: 100vw;
  height: 100vh;
}
</style>
