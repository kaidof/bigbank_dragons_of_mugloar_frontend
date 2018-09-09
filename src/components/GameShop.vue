<template>
  <div id="shop">
    <button class="btn" :disabled="!getGameId" @click="getShopItems">Load shop items</button>

    <h2>Gold: {{ getGameData.gold }}</h2>

    <div
      class="item" v-for="item in getGameShopItems" :key="item.id"
    >
      <button
        class="btn"
        :disabled="(getGameData.hasOwnProperty('gold') && item.cost > getGameData.gold)"
        @click="buyItem(item.id)"
      >Buy</button>

      <span class="cost" title="Cost">{{ item.cost }}</span>
      <span class="bought" title="Purchased item quantity">
        {{ getGameShopBoughtItems.hasOwnProperty(item.id) ? getGameShopBoughtItems[item.id] : 0 }}
      </span>
      <span class="name">{{ item.name }}</span>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'GameShop',
    computed: {
      ...mapGetters(['getGameId', 'getGameData', 'getGameShopItems', 'getGameShopBoughtItems']),
    },
    methods: {
      getShopItems() {
        this.$store.dispatch('GET_SHOP_ITEMS')
      },
      buyItem(id) {
        this.$store.dispatch('PURCHASE_SHOP_ITEM', id)
      }
    },
  }
</script>

<style scoped lang="scss">
  #shop {
    padding: 10px;

    .item {
      background-color: #eff6f6;
      margin-bottom: 3px;
      padding: 5px;

      .cost {
        font-weight: bold;
        color: orange;
        display: inline-block;
        min-width: 40px;
        text-align: right;
        margin-right: 5px;
      }

      .bought {
        font-weight: bold;
        color: #77b08c;
        display: inline-block;
        min-width: 20px;
        text-align: right;
        margin-right: 5px;
      }

      .name {
        font-size: 14px;
      }

      .btn {
        background-color: #28932f;

        &:hover {
          background-color: #43a549;
        }

        &:disabled {
          background-color: #a1b0a2;
          color: #e4e4e4;
          cursor: auto;
        }
      }
    }
  }
</style>
