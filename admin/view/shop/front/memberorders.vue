<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  div
    front-nav(:cartnum="cartNum")
    .w80perm0auto
      h2 Your Orders
      el-card.box-card.card1(v-for="item in dataAll", :key="item.id")
        template(#header)
          .card-header
            div.leftcard
              span {{ $t('orderid') }}
                | {{ item.order_id }}
              template
                span.red(v-if="item.paid === 0") {{ $t('paysts') }}
                  | {{ $t('notpaid') }}
                span.green(v-if="item.paid === 1") {{ $t('paysts') }}
                  | {{ $t('paid') }}
              template
                span.lightgrey(v-if="item.shipped === 0") {{ $t('shipsts') }}
                  | {{ $t('noship') }}
                span.grey(v-if="item.shipped === 1") {{ $t('shipsts') }}
                  | {{ $t('onship') }}
                span(v-if="item.shipped === 2") {{ $t('shipsts') }}
                  | {{ $t('shipped') }}
              template
                span.lightgrey(v-if="item.finished === 0") {{ $t('ordersts') }}
                  | {{ $t('odyet') }}
                span(v-if="item.finished === 1") {{ $t('ordersts') }}
                  | {{ $t('odgood') }}
                span.orange(v-if="item.finished === 2") {{ $t('ordersts') }}
                  | {{ $t('odno') }}
            div.rightcard
              el-button(text, @click="item.coco = !item.coco") See Details
        .text.item.card-body
          span {{ $t('paym') }}

            | {{ item.pmethod }}
          span {{ $t('transm') }}

            | {{ item.tmethod }}
          span {{ $t('getname') }}
            | {{ item.recevivename }}
          span {{ $t('total') }}
            | $
            | {{ item.total_price }}
          br
          span {{ $t('gettel') }}
            | {{ item.recevivephone }}
          span {{ $t('getaddr') }}
            | {{ item.receviveaddr }}
          span {{ $t('orderdate') }}

            | {{ item.createtime }}
        .bottom.mt5(v-show="item.coco")
          el-card.box-card.card2(v-for="more in item.details", :key="more.id")
            .text.item.card-body
              el-row(type="flex", justify="center")
                el-col(:span="1")
                  img.w50h50(:src="more.pic1")
                el-col(:span="4")
                  span {{ more.proc_name }}
                el-col(:span="4")
                  span {{ $t('amount') }}
                    | {{ more.amount }}
                el-col(:span="4")
                  span {{ $t('price') }}
                    | $
                    | {{ more.price }}
                el-col(:span="4")
                  span {{ $t('count') }}
                    | $
                    | {{ more.amount * more.price }}
                el-col(:span="4")
                  el-link(:href="`/shop/shophome/procdetails?procid=${more.proc_id}`", type="info") {{ $t('buyagain') }}
</template>

<script>
import street from '~/api/street';
import frontNav from '../components/frontNav';

export default {
  name: 'memOrders',
  components: {
    frontNav,
  },
  data() {
    return {
      coco: false,
      cartNum: 0,
      dataAll: [],
    };
  },
  created() {
    this.getLogin();
  },
  mounted() {
    this.countCart();
    this.getMemOrders();
  },
  methods: {
    countCart() {
      street.countCart()
        .then(resc => {
          this.cartNum = resc.data;
        })
        .catch();
    },
    getMemOrders() {
      street.getMemOrders()
        .then(res => {
          this.dataAll = res.data;
          delete this.dataAll.response_code;
        })
        .catch();
    },
    getLogin() {
      street.getLogin()
        .then(resl => {
          if (resl.data.length === 0) {
            this.$router.push({ name: 'login' });
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.w100 {
  width: 100px;
}

.wid100per {
  width: 100%;
}

.mt-20 {
  margin-top: 20px;
}

.card-header span {
  margin: 0 11px;
}

.card-body span {
  margin: 0 11px;
  font-size: 1em !important;
}

/deep/ .el-card__body {
  padding: 7px 20px 7px 20px;
}

/deep/ .text {
  margin-top: 0px;
}

/deep/ .el-card__header {
  padding: 13px 20px;
  border-bottom: 1px solid #EBEEF5;
  box-sizing: border-box;
}

.w50h50 {
  width: 25px;
  height: 25px;
  // margin: 2px auto !important;
  object-fit: contain;
}

/deep/ span {
  padding-top: 3px;
}

.w80perm0auto {
  width: 80%;
  margin: 0 auto;
}

.card1 {
  width: 100%;
  margin-bottom: 5px;
}

.mt5 {
  margin-top: 5px;
}

.card2 {
  width: 90%;
}

.red {
  color: rgb(223, 66, 66);
}

.green {
  color: rgb(82, 216, 82);
}

.lightgrey {
  color: rgb(185, 185, 185);
}

.grey {
  color: rgb(151, 151, 151);
}

.orange {
  color: rgb(252, 135, 39);
}

.leftcard {
  align-self: center;
  width: 80%;
}

.rightcard {
  align-self: center;
}

/deep/ .card-header {
  display: flex;
  flex-direction: row;
}
</style>
