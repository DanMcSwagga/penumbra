<template>
  <div id="app" class="app">
    <Header />
    <span class="recorder-wrapper" @click="record">
      <vue-record-video @result="recordStop" />
    </span>
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Header
  },

  computed: {
    ...mapState(['isRecording', 'loggedState'])
  },

  data() {
    return { hasRecordingStarted: false }
  },

  methods: {
    recordStop(videoData) {
      console.log('▶ Downloadable video', URL.createObjectURL(videoData))
      this.downloadLocal(videoData, `penumbra-${Date.now()}.mp4`)

      console.log('▶ Logged data', this.loggedState)
      this.downloadLocal(
        JSON.stringify(this.loggedState, null, 2),
        `penumbra-${Date.now()}.json`,
        'text/plain'
      )
    },

    downloadLocal(data, filename, contentType = undefined) {
      const link = document.createElement('a')
      const file = new Blob([data], { type: contentType })
      link.href = URL.createObjectURL(file)
      link.download = filename
      link.click()
    },

    record() {
      this.isRecording
        ? this.$store.dispatch('stopRecording')
        : this.$store.dispatch('startRecording')
    }
  }
}
</script>

<style lang="scss">
@import './palette.scss';

html,
body {
  margin: 0;
  padding: 0;
  // font-family: 'Roboto', sans-serif;
  font-family: 'Montserrat', sans-serif;
  background: $tertiary;
  height: 100%;
  // overflow: hidden; // TODO: implement at later stages
}

body {
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

.no-display {
  display: none !important;
}
.display {
  display: block;
}
.fixed {
  position: fixed;
}
.hidden {
  visibility: hidden;
}

.app {
  display: flex;
  width: 100vw;
  flex-grow: 1;
  position: relative;
  flex-direction: column;
  // height: 100vh;
}

.recorder-wrapper {
  position: fixed;
  width: 2.5em;
  top: 1em;
  left: calc(50vw - 1.25em);
  z-index: 10;
}

.vue-video-recorder {
  & > div.recorder-icon {
    width: 2.5em;
    height: 2.5em;
    color: $primary;
    background-color: $primary;

    & span {
      font-size: 0;
    }

    &:before {
      content: '▶';
      color: white;
    }

    &:hover {
      background-color: $secondary;
    }
  }

  &.active {
    & > div.recorder-icon {
      position: relative;
      &:before {
        content: '◼';
        color: $tertiary;
      }
      &:after {
        position: absolute;
        content: '⬤';
        font-size: 1em;
        top: -1em;
        right: -1em;
        color: $highlight-primary;
        animation: 1.5s ease-in-out infinite blink;
      }
    }
  }
}

@keyframes blink {
  0% {
    filter: opacity(1);
  }
  50% {
    filter: opacity(0);
  }
  100% {
    filter: opacity(1);
  }
}
</style>
