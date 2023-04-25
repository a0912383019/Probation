<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  nav-menu(:menu='navs', :nowTag='Tag')
    template(#payment)
      back-pay.cont(v-show="Tag == 'payment'")
    template(#transport)
      back-trans.cont(v-show="Tag === 'transport'")
    template(#category)
      back-cate.cont(v-show="Tag === 'category'")
    template(#item)
      back-item.cont(v-show="Tag === 'item'")
    template(#spec)
      back-spec.cont(v-show="Tag === 'spec'")
    template(#size)
      back-size.cont(v-show="Tag === 'size'")
    template(#products)
      back-proc.cont(v-show="Tag === 'products'")
    template(#stock)
      back-stock.cont(v-show="Tag === 'stock'")
    template(#membersetting)
      back-member.cont(v-show="Tag === 'membersetting'")
    template(#backorders)
      back-orders.cont(v-show="Tag === 'backorders'")
</template>

<script>
import navMenu from '../components/backNav'; // navbar
import backPay from './payment';
import backTrans from './transport';
import backCate from './category';
import backItem from './item';
import backSpec from './spec';
import backSize from './size';
import backProc from './products';
import backStock from './stock';
import backMember from './backmem';
import backOrders from './backOrders';

export default {
  name: 'cool',
  components: {
    navMenu,
    backPay,
    backTrans,
    backCate,
    backItem,
    backSpec,
    backSize,
    backProc,
    backStock,
    backMember,
    backOrders,
  },
  data() {
    return {
      navs: [
        {
          name: 'payment',
          label: this.$t('payment'),
          url: '/shop/shopback/payment',
          smallTitle: '',
        },
        {
          name: 'transport',
          label: this.$t('transport'),
          url: '/shop/shopback/transport',
          smallTitle: '',
        },
        {
          name: 'category',
          label: this.$t('category'),
          url: '/shop/shopback/category/cate',
          smallTitle: [
            {
              name: 'category',
              label: this.$t('category'),
              url: '/shop/shopback/category/cate',
            },
            {
              name: 'item',
              label: this.$t('item'),
              url: '/shop/shopback/category/item',
            },
            {
              name: 'spec',
              label: this.$t('spec'),
              url: '/shop/shopback/category/spec',
            },
            {
              name: 'size',
              label: this.$t('size'),
              url: '/shop/shopback/category/size',
            },
          ],
        },
        {
          name: 'products',
          label: this.$t('products'),
          url: '/shop/shopback/products/proc',
          smallTitle: [
            {
              name: 'products',
              label: this.$t('products'),
              url: '/shop/shopback/products/proc',
            },
            {
              name: 'stock',
              label: this.$t('stock'),
              url: '/shop/shopback/products/stock',
            },
          ],
        },
        {
          name: 'membersetting',
          label: this.$t('membersetting'),
          url: '/shop/shopback/member',
          smallTitle: '',
        },
        {
          name: 'backorders',
          label: this.$t('backorders'),
          url: '/shop/shopback/orders',
          smallTitle: '',
        },
      ],
      Tag: '',
    };
  },
  watch: {
    $route() {
      this.urlLoad();
    },
  },
  mounted() {
    this.urlLoad();
  },
  methods: {
    urlLoad() {
      this.Tag = this.$route.name;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .cont {
  margin-left: 6%;
  margin-right: 6%;
  margin-bottom: 200px;
  padding-bottom: 40px;
}
</style>
