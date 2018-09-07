<template>
  <header>
    <div class="title">Dragons of Mugloar</div>

    <button class="btn" :disabled="getGameId" @click="newGame">Start new game</button>

    <div id="stat">
      <div class="item">Lives: <span>{{ getGameData.lives }}</span></div>
      <div class="item">Score: <span>{{ getGameData.score }}</span></div>
      <div class="item">Turn: <span>{{ getGameData.turn }}</span></div>
    </div>

  </header>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'GameHeader',
    computed: {
      ...mapGetters(['getGameId', 'getGameData', 'getGameMessages']),
    },
    methods: {
      newGame() {
        this.$store.dispatch('START_GAME')
      },
      fetchMessages() {
        this.$store.dispatch('FETCH_MESSAGES')
      }
    },
  }
</script>

<style scoped lang="scss">
  header {
    padding: 10px;
    background-color: aliceblue;

    .title {
      font-size: 22px;
      margin-bottom: 5px;
    }
  }

  #stat {
    margin-top: 10px;

    .item {
      display: inline-block;
      background-color: #e8e8e8;
      padding: 5px 15px;
      margin-right: 3px;

      span {
        font-weight: bold;
      }
    }
  }
</style>
