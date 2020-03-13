import { LoaderUtils, LoadingManager } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { onProgress } from '@/utils/onProgress.js'

// TODO: deep-learn about loaders, managers, draco etc,
// understand what setURLModifier does
export default function loadFBX(context) {
  // e.g. in dev mode it is always http://localhost:8080/
  const baseURL = LoaderUtils.extractUrlBase(context.fileURL)

  // Load
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader()
    loader.setCrossOrigin('anonymous')

    const blobURLs = []

    loader.load(
      context.fileURL,
      object => {
        // const scene = object.scene || object.scenes[0]
        const clips = object.animations || []

        object.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        context.setContent(object, clips)

        blobURLs.forEach(URL.revokeObjectURL)

        resolve(object)
      },
      // onProgress
      onProgress,
      // onError
      reject
    )
  })
}
