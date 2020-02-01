<template>
  <div class="placeholder">
    <div class="placeholder-label">
      <p>Drag FBX or GLTF file/folder here</p>
    </div>
    <div class="upload-btn">
      <input
        type="file"
        name="file-input[]"
        id="file-input"
        multiple=""
        :ref="'file-input'"
      />
      <label for="file-input">
        <span>Upload</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
}

.placeholder-label {
  width: 100%;
  max-width: 500px;
  border-radius: 0.5em;
  background: #eee;
  padding: 2em;
  text-align: center;

  p {
    font-size: 1.2rem;
    color: #999;
  }
}

/******************************************************************************
 * Upload Button
 *
 * https://tympanus.net/Tutorials/CustomFileInputs/
 */

.upload-btn {
  margin-top: 2em;
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  label {
    color: #353535;
    border: 0;
    border-radius: 3px;
    transition: ease 0.2s background;
    font-size: 1rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    padding: 0.625rem 1.25rem;
  }
  label:hover {
    background: #ddd;
  }
}
</style>
