import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gameData: {}, // holds game data
    messages: [],
    shopItems: [],
    boughtItems: {},
  },
  mutations: {
    SET_GAME: (state, data) => state.gameData = Object.assign({}, data),

    RESET_GAME: state => {
      state.gameData = {};
      state.messages = [];
      state.shopItems = [];
      state.boughtItems = {};
    },

    CLEAR_MESSAGES: state => state.messages = [],

    SET_MESSAGES: (state, data) => {
      state.messages = Object.assign([], data.map(i => {
        // Initialize item state
        i.fail = false;
        i.totalTurn = state.gameData.turn + i.expiresIn;

        // Prioritize by probability
        switch(i.probability) {
          case 'Piece of cake':
            i.risk = 0;
            break;
          case 'Walk in the park':
            i.risk = 1;
            break;
          case 'Sure thing':
            i.risk = 2;
            break;
          case 'Hmmm....':
            i.risk = 3;
            break;
          case 'Gamble':
            i.risk = 4;
            break;
          case 'Quite likely':
            i.risk = 5;
            break;
          case 'Risky':
            i.risk = 6;
            break;
          case 'Playing with fire':
            i.risk = 7;
            break;
          case 'Rather detrimental':
            i.risk = 8;
            break;
          case 'Suicide mission':
            i.risk = 9;
            break;
          case 'Impossible':
            i.risk = 10;
            break;
          default:
            i.risk = 11;
        }

        return i
      }))
    },

    SOLVE_MESSAGE: (state, { id, data }) => {
      // Update game state
      state.gameData = Object.assign(state.gameData, {
        lives: data.lives,
        gold: data.gold,
        score: data.score,
        turn: data.turn,
      });

      state.messages = state.messages.map(i => {
        if (i.adId === id) {
          i.done = true;
          i.fail = !data.success;
          i.msg = data.message || '';
        }

        return i
      });
    },

    SET_SHOP_ITEMS: (state, data) => state.shopItems = data,

    PURCHASE_SHOP_ITEM: (state, { id, data }) => {
      if (data.shoppingSuccess) {
        // keep track of bought items
        if (!state.boughtItems.hasOwnProperty(id)) {
          state.boughtItems[id] = 0;
        }
        state.boughtItems[id]++;
      }

      // Update game state
      state.gameData = Object.assign(state.gameData, {
        lives: data.lives,
        level: data.level,
        gold: data.gold,
        turn: data.turn,
      });
    },

    MODIFY_MESSAGE_BY_ID: (state, { id, data }) => {
      state.messages = state.messages.map(i => {
        return i.adId === id ? Object.assign({}, i, data) : i;
      });
    },
  },
  actions: {
    START_GAME: ({ commit }) => Api.getGame().then(res => commit('SET_GAME', res.data)),

    RESET_GAME: ({ commit }) => commit('RESET_GAME'),

    FETCH_MESSAGES: ({ commit, state }) => {
      Api.getMessages(state.gameData.gameId).then(res => commit('SET_MESSAGES', res.data))
    },

    CLEAR_MESSAGES: ({ commit }) => commit('CLEAR_MESSAGES'),

    SOLVE_MESSAGE: ({ commit, state }, id) => {
      Api.solveMessages(state.gameData.gameId, id).then(res => commit('SOLVE_MESSAGE', { id, data: res.data })).catch(e => {
        // Change message if error response contains error
        if (e && e.data && e.data.hasOwnProperty('error')) {
          commit('MODIFY_MESSAGE_BY_ID', {id, data: { done: true, msg: e.data.error, fail: true }});
        }
      })
    },

    GET_SHOP_ITEMS: ({ commit, state }) => {
      Api.getShopItems(state.gameData.gameId).then(res => commit('SET_SHOP_ITEMS', res.data))
    },

    PURCHASE_SHOP_ITEM: ({ commit, state }, id) => {
      Api.purchaseShopItems(state.gameData.gameId, id).then(res => commit('PURCHASE_SHOP_ITEM', { id, data: res.data }))
    },
  },
  getters: {
    getGameId: state => state.gameData.hasOwnProperty('gameId') ? state.gameData.gameId : null,
    getGameData: state => state.gameData,
    getGameMessages: state => state.messages,
    getGameShopItems: state => state.shopItems,
    getGameShopBoughtItems: state => state.boughtItems,
  }
})
