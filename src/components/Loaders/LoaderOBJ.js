import { LoaderUtils } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { onProgress } from '@/utils/onProgress.js'

export default function loadOBJ(context) {
  // e.g. in dev mode it is always http://localhost:8080/
  const baseURL = LoaderUtils.extractUrlBase(context.fileURL)

  return new Promise((resolve, reject) => {
    // TODO: need to determine which constructor to use here
    // using information caught by Viewer regarding type
    // e.g., loader = determineLoader(type, manager = default)
    // const loader = new OBJLoader(manager)
    const loader = new OBJLoader()
    loader.setCrossOrigin('anonymous')

    const blobURLs = []

    loader.load(
      context.fileURL,
      // called when the resource is loaded
      object => {
        context.setContent(object, [])

        blobURLs.forEach(URL.revokeObjectURL)

        resolve(object)
      },
      onProgress,
      reject
    )
  })
}
