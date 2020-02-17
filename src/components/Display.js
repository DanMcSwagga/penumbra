import { traverseMaterials } from '../utils/utils'
import { SkeletonHelper, GridHelper, AxesHelper } from 'three'

const removeSkeletonHelpers = (skeletonHelpers, scene) => {
  skeletonHelpers.forEach(helper => scene.remove(helper))
}

// material: MeshStandardMaterial (has opacity, color, etc)
// TODO: think of ways of controlling wireframes from GUI (e.g. Sketchfab)
const addWireframe = (content, sceneState) => {
  traverseMaterials(content, material => {
    // console.dir(material)
    material.wireframe = sceneState.wireframe
  })
}

const addSkeleton = (content, scene, skeletonHelpers, sceneState) => {
  content.traverse(node => {
    if (node.isMesh && node.skeleton && sceneState.skeleton) {
      const helper = new SkeletonHelper(node.skeleton.bones[0].parent)
      /* Due to limitations of the OpenGL Core Profile with
          the WebGL renderer on most platforms linewidth will always be 1
          regardless of the set value. */
      // helper.material.linewidth = 5 // still is 1

      scene.add(helper)
      skeletonHelpers.push(helper)
    }
  })
}

/**
 * Updates display-related data, is called in Scene when notified by GUI
 * @param {Object} data object passed from Scene
 * @param {*} sceneState global state managed by VueX
 */
const updateDisplay = (data, sceneState) => {
  // TODO: method needs 'this' context to operate
  // OR: use ...data to get all data components

  // Remove skeleton geometry if present
  if (data.skeletonHelpers.length) {
    removeSkeletonHelpers(data.skeletonHelpers, data.scene)
  }

  // Add all wireframe data to the viewer content
  addWireframe(data.content, sceneState)

  // Form the skeleton base and add it to the scene
  addSkeleton(data.content, data.scene, data.skeletonHelpers, sceneState)

  // TODO: separate axesScene/Helper and gridHelper

  if (sceneState.grid !== Boolean(data.gridHelper)) {
    if (sceneState.grid) {
      // addGridHelper()
      data.gridHelper = new GridHelper()
      data.scene.add(data.gridHelper)

      // TODO: add following as an option to GUI
      // data.gridHelper.material.transparent = true

      // addAxesHelper()
      data.axesHelper = new AxesHelper()
      data.axesHelper.renderOrder = 999
      data.axesHelper.onBeforeRender = renderer => renderer.clearDepth()
      data.scene.add(data.axesHelper)
    } else {
      // removeGridHelper()
      data.scene.remove(data.gridHelper)
      data.gridHelper = null

      // removeAxesHelper()
      data.scene.remove(data.axesHelper)
      data.axesHelper = null
      data.axesRenderer.clear()
    }
  }
}

export default updateDisplay
// export { ... }
