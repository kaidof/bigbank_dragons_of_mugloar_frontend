<template>
  <div id="app">
    <GameHeader></GameHeader>

    <div id="container">
      <GameMessages></GameMessages>
      <GameShop></GameShop>
    </div>

    <div class="loading" :class="{ show: showOverlay }"><div>Loading&#8230;</div></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GameHeader from '@/components/GameHeader.vue'
import GameShop from '@/components/GameShop.vue'
import GameMessages from '@/components/GameMessages.vue'
import { EventBus } from './event'

export default {
  name: 'app',
  components: {
    GameHeader,
    GameShop,
    GameMessages,
  },
  data() {
    return {
      showOverlay: false
    }
  },
  watch: {
    'getGameData.lives' (newCount) {
      if (newCount < 1) {
        // FIXME: overlay alert
        alert('Game over');

        // game over
        this.$store.dispatch('RESET_GAME');
      }
    }
  },
  mounted () {
    EventBus.$on('http-error', error => {
      // FIXME: overlay alert
      alert(error);
    });

    EventBus.$on('overlay', active => this.showOverlay = !!active);
  },
  computed: {
    ...mapGetters(['getGameId', 'getGameData']),
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
