<template>
  <div class="tutorial">
    <h3 class="tutorial__title">Bindings</h3>

    <tabs class="tutorial__control-tabs">
      <tab class="tutorial__control-tab" name="Mouse" :selected="true">
        <ControlTab :content="mouse" type="Mouse controls" />
      </tab>
      <tab class="tutorial__control-tab" name="Touch">
        <ControlTab :content="touch" type="Touch controls" />
      </tab>
      <!-- <tab class="tutorial__control-tab" name="Keyboard">
        <ControlTab :content="keyboard" type="Keyboard controls" />
      </tab> -->
    </tabs>
  </div>
</template>

<script>
import ControlTab from '@/components/ControlTab.vue'
import Tabs from '@/components/Tabs.vue'
import Tab from '@/components/Tab.vue'

import keyboard from '@/assets/controls/keyboard.jpg'
import mouse from '@/assets/controls/mouse.jpg'
import touch from '@/assets/controls/touch.jpg'

export default {
  name: 'tutorial',

  components: {
    ControlTab,
    Tabs,
    Tab
  },

  data: () => ({ keyboard, mouse, touch })
}
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

  &__control-tabs {
    display: flex;
    flex-direction: column;
  }
}
</style>
