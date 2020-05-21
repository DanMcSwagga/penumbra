<template>
  <div class="tutorial">
    <h3 class="tutorial__title">Bindings</h3>

    <ul class="tutorial__control-list">
      <li class="tutorial__control-item">Mouse</li>
      <li class="tutorial__control-item">Touch</li>
      <li class="tutorial__control-item">Keyboard</li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.tutorial {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  &__title {
    text-align: center;
    font-size: 3rem;
  }

  &__control-list {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  &__control-item {
    padding: 2px 6px;
    margin: 0 14px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: #ff1800;
      border-bottom: 2px solid red;
    }
  }
}
</style>
