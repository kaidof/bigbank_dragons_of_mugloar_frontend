<template>
  <div id="message">
    <button class="btn" :disabled="!getGameId" @click="fetchMessages">Fetch messages</button>

    <div class="legend">
      <span class="box success"></span><span style="margin-right: 15px;">Successfully solved</span>
      <span class="box fail"></span><span style="margin-right: 15px;">Solving failed</span>
      <span class="box not"></span><span>No turns</span>
    </div>

    <div class="message-list">
      <div
        class="message-item" v-for="item in messageList" :key="item.adId"
        :class="{
          done: item.done, fail: item.done && item.fail,
          history: !item.done && (getGameData.hasOwnProperty('turn') && item.totalTurn <= getGameData.turn)
        }"
      >
        <button
          class="btn"
          :disabled="item.done || (getGameData.hasOwnProperty('turn') && item.totalTurn <= getGameData.turn)"
          @click="solveMessage(item.adId)"
        >Solve</button>
        <div class="msg">{{ item.message }}</div>
        <div class="info"><span class="reward">Reward: {{ item.reward }}</span> {{ item.probability }}</div>
        <div class="msg result">{{ item.msg || '&nbsp;' }}</div>
      </div>

    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'GameMessages',
    computed: {
      ...mapGetters(['getGameId', 'getGameData', 'getGameMessages']),
      messageList() {
        // sort by relevance
        return [...this.getGameMessages].sort((a, b) => {
          if (a.risk === b.risk) {
            if (b.reward === a.reward) {
              return a.totalTurn - b.totalTurn;
            } else {
              return b.reward - a.reward;
            }
          } else {
            return a.risk - b.risk;
          }
        })
      }
    },
    methods: {
      newGame() {
        this.$store.dispatch('START_GAME')
      },
      fetchMessages() {
        this.$store.dispatch('FETCH_MESSAGES')
      },
      solveMessage(id) {
        this.$store.dispatch('SOLVE_MESSAGE', id)
      }
    },
  }
</script>

<style scoped lang="scss">
  #message {
    padding: 10px;

    .message-item {
      padding: 10px;
      background-color: #d0d7df;
      margin-bottom: 3px;

      border-left: 5px solid #d0d7df;

      &.red {
        border-color: red;
      }

      .btn {
        float: left;
        margin-right: 5px;
      }

      .msg {
        font-size: 13px;

        &.result {
          padding-top: 10px;
          font-style: italic;
        }
      }

      .info {
        color: #565656;
        font-size: 14px;
        margin-top: 3px;
      }

      .reward {
        background-color: #e0f1e5;
        padding: 3px 5px;
        border-radius: 3px;
        font-size: 12px;
      }

      &.done {
        background-color: #cccccc;
        border-color: #189e22;
      }

      &.fail {
        background-color: #dcbdbd;
        border-color: #bb4545;
      }

      &.history {
        background-color: #dfdfdf;
        color: #b2b2b2;
        border-color: #555;

        .btn {
          background-color: #ccc;
        }
      }
    }

    .legend {
      margin-top: 10px;
      .box {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;

        &.success {
          background-color: #189e22;
        }
        &.fail {
          background-color: #bb4545;
        }
        &.not {
          background-color: #555;
        }
      }
    }
  }
</style>
