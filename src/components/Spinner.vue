<template>
  <div id="spinner" class="spinner"></div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
/******************************************************************************
 * CSS Spinner
 *
 * http://tobiasahlin.com/spinkit/
 */
.spinner {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -20px;
  z-index: 1000;

  // background-color: #333;
  background-color: #ff0000;

  border-radius: 100%;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>
