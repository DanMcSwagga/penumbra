import { UnsignedByteType } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { environments } from './environments'

const getCubeMapTexture = (environment, pmremGenerator) => {
  const { path } = environment

  console.log('PATH!!')
  console.dir(path)

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

  getCubeMapTexture(environment, data.pmremGenerator)
    .then(({ envMap }) => {
      // if (
      // (!envMap || !sceneState.background) &&
      // this.activeCamera === this.defaultCamera
      // ) {
      // this.scene.add(this.vignette)
      // } else {
      // this.scene.remove(this.vignette)
      // }

      store.commit('setSceneProp', { environment: envMap })
      store.commit('setSceneProp', {
        background: sceneState.background ? envMap : null
      })
    })
    .catch(error => console.log(error))
}

export default updateEnvironment
