<template>
  <div>
    <div class="tabs">
      <ul class="tabs__list">
        <li
          v-for="tab in tabs"
          :class="{ 'is-active': tab.isActive }"
          class="tabs__item"
          :key="tab.href"
        >
          <a :href="tab.href" class="tabs__item-link" @click="selectTab(tab)">
            {{ tab.name }}
          </a>
        </li>
      </ul>
    </div>

    <div class="tabs__details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',

  data() {
    return { tabs: [] }
  },

  created() {
    this.tabs = this.$children
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = tab.name === selectedTab.name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../palette.scss';

.tabs {
  &__list {
    display: flex;
    justify-content: center;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  &__item {
    padding: 2px 6px;
    margin: 0 14px;
    border-bottom: 2px solid transparent;
    color: inherit;
    transition: ease 0.2s border;
    cursor: pointer;

    &:hover,
    &.is-active {
      border-bottom: 2px solid $highlight-primary;
      color: $highlight-primary;
    }
  }
  &__item-link {
    color: inherit;
    font-weight: bold;
    text-decoration: none;
    transition: ease 0.2s color;
  }

  &__details {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }
}
</style>
