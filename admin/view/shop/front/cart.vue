<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  div
    front-nav(:cartnum="cartNum")
    h3.title Shopping Cart
    .theleft
      el-table.tableWidth(:data="dataAll", border)
        el-table-column.imgcont(label="Img", width="80px")
          template(slot-scope="scope")
            img.w50h50(:src="scope.row.pic1")
        el-table-column(label="Name", width="120px")
          template(slot-scope="scope")
            span {{ scope.row.proc_name }}
            span(v-if="scope.row.size !== ''")
              |&nbsp;&nbsp;[
              | {{ scope.row.size }}
              | ]
        el-table-column(label="Amount", width="125px")
          template(slot-scope="{row, $index}")
            el-input-number(v-model="row.amount", :min="1", :max="999", size="small", @change="handleChange(row.amount, $index)")
        el-table-column(label="Price", width="90px")
          template(slot-scope="scope")
            span $
              | {{ scope.row.price }}
        el-table-column(label="Subtotal", width="90px")
          template(slot-scope="scope")
            span $
              | {{ scope.row.price * scope.row.amount }}
        el-table-column(label="Stock", width="90px")
          template(slot-scope="scope")
            span.success(v-if="scope.row.stock >= scope.row.amount") {{ scope.row.stock }}
            span.red(v-else) {{ scope.row.stock }}
        el-table-column(width="90px")
          template(slot-scope="{$index}")
            el-button(size="small", type="danger", @click="delCart($index)") Delete
    .theright
      el-card.rightdiv
        h3 {{ $t('seeall') }}
        hr
        div
          h5 {{ dataAll.length }}
            |&nbsp;
            | items
          h5 {{ $t('shipintro') }}
        div
          h6 {{ $t('shipsay') }}
        h5 {{ $t('payment') }}
        h6.descont {{ $t('paysay') }}
        div
          el-radio-group(v-model="choosePay")
            el-radio(v-for="item in payment", :key="item.id", :label="item.payment_id", size="small") {{ item.method }}
        h5 {{ $t('transport') }}
        div
          el-radio-group(v-model="chooseTrans")
            el-radio(v-for="item in transport", :key="item.id", :label="item.transport_id", size="small") {{ item.method }}
        hr
        div
          h5 {{ $t('total') }}
            | $
            | {{ total }}

            br
          h6 {{ $t('shiptip') }}
            | $
            | {{ transcost }}
        el-button.btn40per(type="primary", size="small", @click="gopay") {{ $t('gopay') }}
</template>

<script>
import street from '~/api/street';
import frontNav from '../components/frontNav';

export default {
  name: 'cart',
  components: {
    frontNav,
  },
  data() {
    return {
      cartNum: 0,
      dataAll: [],
      total: 0,
      payment: [],
      choosePay: '',
      transport: [],
      chooseTrans: '',
      transcost: 0,
      over: false,
      mem: [],
    };
  },
  created() {
    this.countCart();
  },
  mounted() {
    this.getCart();
    this.getPayment();
    this.getTrans();
    this.checkLogin();
    this.getTot();
  },
  methods: {
    countCart() {
      street.countCart()
        .then(resc => {
          this.cartNum = resc.data;
        })
        .catch();
    },
    getPayment() {
      street.getPayment()
        .then(resp => {
          this.payment = resp.data;
          this.choosePay = this.payment[0].payment_id;
        })
        .catch();
    },
    getTrans() {
      street.getTrans()
        .then(resta => {
          this.transport = resta.data;
          this.chooseTrans = this.transport[0].transport_id;
        })
        .catch();
    },
    getCart() {
      street.getCart()
        .then(res => {
          for (let i = 0; i < Object.keys(res.data).length - 1; i += 1) {
            this.$set(this.dataAll, i, res.data[i]);
          }
          this.isOver();
        })
        .catch();
    },
    handleChange(value, idx) {
      street.updateAmount(value, idx)
        .then(res => {
          if (res) {
            this.getTot();
          }
        })
        .catch();
      this.isOver();
    },
    delCart(idx) {
      street.delCart(idx)
        .then(res => {
          if (res) {
            this.getTot();
          }
        })
        .catch();
      this.dataAll.splice(idx, 1);
      this.cartNum = this.cartNum - 1;
      this.isOver();
    },
    getTot() {
      street.getTot()
        .then(rest => {
          this.total = rest.data[0];
          this.transcost = rest.data[1];
        })
        .catch();
    },
    isOver() {
      this.over = false;
      this.dataAll.forEach(ele => {
        if (ele.stock < ele.amount) {
          this.over = true;
        }
      });
    },
    gopay() {
      if (this.cartNum === 0) {
        this.$notify.error('Cart is empty!');
        return false;
      }
      this.checkLogin();
      if (this.over) {
        this.$notify.error(this.$t('stockerr'));
        return false;
      }
      if (this.mem.length === 0) {
        this.$notify.warning(this.$t('loginfst'));
        this.$router.push({ name: 'login', params: { isFromCart: 'yes' } });
        return false;
      }
      if (this.mem.suspended === 1) {
        this.$notify.error(this.$t('suspended'));
        return false;
      }
      this.$router.push({ name: 'gopay', params: { pay: this.choosePay, trans: this.chooseTrans } }).catch(() => {});
      return true;
    },
    checkLogin() {
      street.getLogin()
        .then(resl => {
          this.mem = resl.data;
        })
        .catch(() => {
          this.$notify.error('error');
        });
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.w50h50 {
  width: 50px;
  height: 50px;
  margin: auto;
  object-fit: contain;
}

.tableWidth {
  margin-top: 20px;
  width: 685px;
}

/deep/ .el-input-number--small .el-input-number__decrease {
  width: 22px;
  font-size: 11px;
}

/deep/ .el-input-number--small .el-input-number__increase {
  width: 22px;
  font-size: 11px;
}

/deep/ .el-input-number--small {
  width: 100px;
  line-height: 30px;
}

h5 {
  margin-block-end: 3px;
}

h6 {
  margin-block-start: 3px;
}

.rightdiv {
  width: 300px;
  float: left;
  margin-top: 20px;
  margin-left: 40px;
  background-color: rgb(37, 60, 96);
  color: rgb(232, 232, 232);
}

/deep/ .el-radio {
  color: #e5e5e5;
  cursor: pointer;
  margin-right: 30px;
}

/deep/ .el-radio__label {
  font-size: 10px;
  padding-left: 8px;
}

/deep/ .el-radio__inner {
  border: 1px solid #DCDFE6;
  border-radius: 100%;
  width: 12px;
  height: 12px;
}

.red {
  color: red;
}

.success {
  color: rgb(74, 179, 83);
}

.title {
  margin-block-end: 0px;
  margin-left: 40px;
}

.theleft {
  margin: 10px 0 10px 40px;
  float: left;
}

.imgcont {
  margin: 0 auto;
}

.descont {
  margin-block-end: 3px;
}

.btn40per {
  margin-left: 40%;
}
</style>
