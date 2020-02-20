import { AnimationMixer } from 'three'

/**
 * Updates animation-related data, is called in Scene when notified by GUI
 * @param {Object} data object passed from Scene
 * @param {*} sceneState global state managed by VueX
 */
const updateAnimation = (data, sceneState) => {
  if (data.mixer) data.mixer.timeScale = sceneState.playbackSpeed
}

const setClips = (data, clips) => {
  if (data.mixer) {
    data.mixer.stopAllAction()
    data.mixer.uncacheRoot(data.mixer.getRoot())
    data.mixer = null
  }

  data.clips = clips
  if (!clips.length) return

  data.mixer = new AnimationMixer(data.content)
}

const playClips = data => {
  data.clips.forEach(clip => {
    data.mixer
      .clipAction(clip)
      .reset()
      .play()
    // data.state.actionStates[clip.name] = true
  })
}

const playAnimations = data => {
  if (data.clips.length) {
    // add '' to global store for manipulation
    // data.animFolder.domElement.style.display = ''

    // const actionStates = (data.state.actionStates = {})
    data.clips.forEach((clip, clipIndex) => {
      // Autoplay the first clip.
      let action
      // if (clipIndex === 0) {
      // actionStates[clip.name] = true
      action = data.mixer.clipAction(clip)
      action.play()
      // } else {
      // actionStates[clip.name] = false
      // }

      // // Play other clips when enabled.
      // const ctrl = data.animFolder.add(actionStates, clip.name).listen()
      // ctrl.onChange(playAnimation => {
      //   action = action || data.mixer.clipAction(clip)
      //   action.setEffectiveTimeScale(1)
      //   playAnimation ? action.play() : action.stop()
      // })
      // data.animCtrls.push(ctrl)
    })
  }
}

export default updateAnimation

export { setClips, playClips, playAnimations }
