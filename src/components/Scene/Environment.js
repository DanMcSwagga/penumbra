import { UnsignedByteType, Color } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { environments } from '../../data/environments'

const getCubeMapTexture = (environment, pmremGenerator) => {
  const { path } = environment

  // no envmap
  if (!path) return Promise.resolve({ envMap: null })

  return new Promise((resolve, reject) => {
    new RGBELoader().setDataType(UnsignedByteType).load(
      path,
      texture => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture
        pmremGenerator.dispose()

        resolve({ envMap })
      },
      undefined,
      reject
    )
  })
}

/**
 * Updates environment-related data, is called in Scene when notified by GUI
 * @param {Object} data object passed from Scene
 * @param {Object} sceneState global scene state managed by VueX
 * @param {Object} store global VueX store
 */
const updateEnvironment = (data, sceneState, store) => {
  const environment = environments.filter(
    entry => entry.name === sceneState.environment
  )[0]

  console.log('Starting update env')
  getCubeMapTexture(environment, data.pmremGenerator)
    .then(({ envMap }) => {
      store.commit('DEACTIVATE_SPINNER')
      // TODO: Needed if we want custom colored background
      // if (
      // (!envMap || !sceneState.background) &&
      // data.activeCamera === data.defaultCamera
      // ) {
      // data.scene.background = new Color(0xa0a0a0)
      // } else {
      // data.scene.remove(data.vignette)
      // }

      data.scene.environment = envMap
      data.scene.background = sceneState.background ? envMap : null
    })
    .catch(error => {
      store.commit('DEACTIVATE_SPINNER')
      console.log(error)
    })
}

export default updateEnvironment
