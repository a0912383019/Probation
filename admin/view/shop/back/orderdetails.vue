<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  .odcont
    el-card.theleft.outpay
      div(v-show="whopay.payment_id === 2")
        h3 {{ $t('paycredit') }}
        hr
        h5.grey {{ $t('orderguy') }}
        h4 {{ $t('realname') }}
          | {{ whopay.payname }}
        h4 {{ $t('gender') }}
          | {{ whopay.paygender }}
        h4 {{ $t('identity') }}
          | {{ whopay.payidentity }}
        h4 {{ $t('birth') }}
          | {{ whopay.paybirth }}
        h4 {{ $t('paycredit') }}
          | {{ whopay.creditcard }}
        h4 {{ $t('valid') }}
          | {{ whopay.validtime }}
        h4 {{ $t('safecode') }}
          | {{ whopay.safecode }}
        h4 {{ $t('phone') }}
          | {{ whopay.payphone }}
        h4 {{ $t('address') }}
          | {{ whopay.payaddr }}
        hr
        h5.grey {{ $t('getguy') }}
        h4 {{ $t('realname') }}
          | {{ whopay.recevivename }}
        h4 {{ $t('phone') }}
          | {{ whopay.recevivephone }}
        h4 {{ $t('address') }}
          | {{ whopay.receviveaddr }}
      div(v-show="whopay.payment_id === 3")
        h3 {{ $t('payatm') }}
        hr
        h5.grey {{ $t('orderguy') }}
        h4 {{ $t('realname') }}
          | {{ whopay.aname }}
        h4 {{ $t('phone') }}
          | {{ whopay.aphone }}
        h4 {{ $t('address') }}
          | {{ whopay.aaddr }}
        hr
        h5.grey {{ $t('getguy') }}
        h4 {{ $t('realname') }}
          | {{ whopay.recevivename }}
        h4 {{ $t('phone') }}
          | {{ whopay.recevivephone }}
        h4 {{ $t('address') }}
          | {{ whopay.receviveaddr }}
    el-card.theright.outorder
      h3 {{ $t('details') }}
      hr
      div(v-for="item in dataAll", :key="item.id")
        .flex-container
          div
            h5 Proc_ID:
              | {{ item.proc_id }}
            img.imgclass(:src="item.pic1")
          div
            h4 {{ $t('procname') }}
              | {{ item.proc_name }}
            h4 {{ $t('stocdid') }}
              | {{ item.stock_id }}
            h4 {{ $t('buynum') }}
              | {{ item.amount }}
            h4 {{ $t('price') }}$
              | {{ item.price }}
        hr
      h4 {{ $t('total') }}$
        | {{ tot }}
</template>

<script>
import shop from '~/api/shop';

export default {
  name: 'backOrders',
  data() {
    return {
      dataAll: [],
      orderid: this.$route.query.oid,
      whopay: [],
      tot: 0,
    };
  },
  watch: {
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/setKeepLoading', false);
    }, 500);
    this.getOrdersDetails();
    this.getWhoPay();
  },
  methods: {
    getOrdersDetails() {
      shop.getOrdersDetails(this.orderid)
        .then(res => {
          this.dataAll = res.data;
          this.tot = res.data[0].total_price;
        })
        .catch();
    },
    getWhoPay() {
      shop.getWhoPay(this.orderid)
        .then(resi => {
          this.whopay = resi.data;
        })
        .catch();
    },
  },
};
</script>
<style lang="scss" scoped>
.imgclass {
  background-color: rgb(255, 255, 255);
  width: 150px;
  height: 150px;
  margin: auto;
  object-fit: contain;
}

h5 {
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
}

.flex-container {
  display: flex;
  justify-content: center;
}

.flex-container>div {
  width: 170px;
  margin: 10px;
}

h3 {
  margin-top: 20px;
}

.outorder {
  width: 400px;
  background-color: rgb(201, 227, 255);
  display: inline-block;
  margin: 0 15px;
}

.outpay {
  vertical-align: top;
  width: 300px;
  background-color: rgb(179, 241, 238);
  display: inline-block;
  margin: 0 15px;
}

.odcont {
  width: 795px;
  margin: 40px auto;
  padding: 15px;
}

.grey {
  color: rgba(73, 73, 73, 0.569)}
</style>
