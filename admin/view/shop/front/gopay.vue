<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  div
    front-nav(:cartnum="cartNum")
    el-card.mycard
      div
        h3 {{ $t('thisorder') }} $ {{ total }}
        hr
        div
          el-button(type="primary", size="small", plain, @click="showorhide = !showorhide") {{ $t('opendet') }}
        div(v-show="showorhide")
          el-table.tableWidth(:data="dataAll", border)
            el-table-column.img(label="Img", width="60px")
              template(slot-scope="scope")
                img.w30h30(:src="scope.row.pic1")
            el-table-column(label="Name", width="110px")
              template(slot-scope="scope")
                span {{ scope.row.proc_name }}
                span(v-if="scope.row.size !== ''") [ {{ scope.row.size }} ]
            el-table-column(label="Amount", width="90px")
              template(slot-scope="scope")
                span {{ scope.row.amount }}
            el-table-column(label="Price", width="90px")
              template(slot-scope="scope")
                span $ {{ scope.row.price }}
            el-table-column(label="Subtotal", width="90px")
              template(slot-scope="scope")
                span $ {{ scope.row.price * scope.row.amount }}
            el-table-column(label="Stock", width="90px")
              template(slot-scope="scope")
                span.success(v-if="scope.row.stock >= scope.row.amount") {{ scope.row.stock }}
                span.red(v-else) {{ scope.row.stock }}
        hr
        template(v-if="payment === 3 && transport !== 1")
          h4 {{ $t('paydet') }}
          .ml-20
            el-row(:class="atmcss[0]", :gutter="40")
              span.mr5px {{ $t('thename') }}
              el-input.w80.mr5px(v-model="payname", size="small")
              span {{ $t('chinesename') }}
            el-row(:class="atmcss[1]", :gutter="40")
              span.mr5px {{ $t('telphone') }}
              el-input.w100(v-model="payphone", size="small")
            el-row(:class="atmcss[2]", :gutter="40")
              span.mr5px {{ $t('paperaddr') }}
              el-input.w150(v-model="payaddr", size="small")
            el-row(:gutter="40")
              el-link.clicksame(@click.native="sameMem") {{ $t('buygetsame') }}
          hr
          h4 {{ $t('getpeo') }}
          .ml-20
            el-row(:gutter="40")
              el-link.mr20px.clicksame(@click.native="samePay") {{ $t('samepay') }}
              span.mr5px(:class="getcss[0]") {{ $t('thename') }}
              el-input.w80.mr5px(v-model="getname", size="small")
              span(:class="getcss[0]") {{ $t('chinesename') }}
            el-row(:class="getcss[1]", :gutter="40")
              span.mr5px {{ $t('telphone') }}
              el-input.w100(v-model="getphone", size="small")
            el-row(:class="getcss[2]", :gutter="40")
              span.mr5px {{ $t('getaddri') }}
              el-input.w150(v-model="getaddr", size="small")
          hr
          .center
            h5(:class="getcss[3]")
              el-checkbox(v-model="agree", :class="getcss[3]", type="checkbox", :label="$t('readgood')")
            el-button(plain, @click="sendOrder('a')") {{ $t('semdyes') }}
        template(v-else-if="payment === 2 && transport !== 1")
          h4 {{ $t('paydet') }}
          div
            .ml-20
              el-row(:gutter="40")
                span.mr5px(:class="creditcss[0]") {{ $t('thename') }}
                el-input.mr5px.w70(v-model="payname", size="small")
                span.mr5px(:class="creditcss[0]") {{ $t('chinesename') }}

                span.mr20px(:class="creditcss[1]")
                el-radio-group.mr20px(v-model="paygender")
                  el-radio(label="male", size="small") {{ $t('man') }}
                  el-radio(label="female") {{ $t('woman') }}

                span.mr5px(:class="creditcss[2]") {{ $t('identityi') }}
                el-input.w108(v-model="payidentity", size="small", maxlength="10")
              el-row(:gutter="40")
                span(:class="creditcss[3]") {{ $t('birthi') }}
                el-input.mr5px.w40(v-model="biry", size="small", maxlength="3")
                span.mr5px(:class="creditcss[3]") {{ $t('year') }}
                el-input.mr5px.w40(v-model="birm", size="small", maxlength="2")
                span.mr5px(:class="creditcss[3]") {{ $t('month') }}
                el-input.mr5px.w40(v-model="bird", size="small", maxlength="2")
                span.mr20px(:class="creditcss[3]") {{ $t('day') }}
                span.mr5px(:class="creditcss[4]") {{ $t('telphone') }}
                el-input.w105(v-model="payphone", size="small")
              el-row(:gutter="40")
                span.mr5px(:class="creditcss[5]") {{ $t('creditcardi') }}
                el-input.w165(v-model="credit", size="small", maxlength="19", @keydown.native="addspace")
              el-row(:gutter="40")
                span.mr5px(:class="creditcss[6]") {{ $t('validi') }}
                el-select.w80.mr5px(v-model="validmonth", size="small", placeholder="Select")
                  el-option(v-for="i in 9", :key="i + 'do'", :value="'0' + i", :label="'0' + i")
                  template(v-for="j in 12")
                    el-option(v-if="j > 9", :key="j + 'mo'", :value="j")
                span.mr5px(:class="creditcss[6]") {{ $t('month') }}
                el-select.w80.mr5px(v-model="validyear", size="small", placeholder="Select")
                  template(v-for="k in 35")
                    el-option(v-if="k > 21", :key="k + 'co'", :value="k", :label="k")
                span.mr20px(:class="creditcss[6]") {{ $t('year') }}
                span.mr5px(:class="creditcss[7]") {{ $t('safecodei') }}
                el-input.w50(v-model="safecode", size="small", maxlength="3")
              el-row(:gutter="40")
                span.mr5px(:class="creditcss[8]") {{ $t('creaddr') }}
                el-input.w200(v-model="payaddr", size="small", maxlength="19")
              el-row(:gutter="40")
                el-link.clicksame(@click.native="sameMem") {{ $t('buygetsame') }}
            hr.my-4
          h4 {{ $t('getpeo') }}
          .ml-20
            el-row(:gutter="40")
              el-link.clicksame.mr20px(@click.native="samePay") {{ $t('samepay') }}
              span.mr5px(:class="getcss[0]") {{ $t('thename') }}
              el-input.mr5px.w80(v-model="getname", size="small")
              span(:class="getcss[0]") {{ $t('chinesename') }}
            el-row(:class="getcss[1]", :gutter="40")
              span.mr5px {{ $t('telphone') }}
              el-input.w100(v-model="getphone", size="small")
            el-row(:class="getcss[2]", :gutter="40")
              span.mr5px {{ $t('getaddri') }}
              el-input.w150(v-model="getaddr", size="small")
          hr
          .center
            h5(:class="getcss[3]")
              el-checkbox(v-model="agree", :class="getcss[3]", type="checkbox", :label="$t('readgood')")
            el-button(plain, @click="sendOrder('b')") {{ $t('semdyes') }}
        template(v-else)
          h3.center {{ $t('nosupport') }}
</template>

<script>
import street from '~/api/street';
import frontNav from '../components/frontNav';

export default {
  name: 'goPay',
  components: {
    frontNav,
  },
  data() {
    return {
      cartNum: 0,
      user: [],
      payment: this.$route.params.pay !== undefined ? this.$route.params.pay : 2,
      transport: this.$route.params.trans !== undefined ? this.$route.params.trans : 2,
      dataAll: [],
      showorhide: false,
      over: false,
      total: 0,
      transcost: 0,
      payname: '',
      payphone: '',
      payaddr: '',
      getname: '',
      getphone: '',
      getaddr: '',
      paygender: 'male',
      payidentity: '',
      biry: '',
      birm: '',
      bird: '',
      credit: '',
      validmonth: '',
      validyear: '',
      safecode: '',
      agree: false,
      atmcss: new Array(3).fill('gooddata'),
      creditcss: new Array(9).fill('gooddata'),
      getcss: new Array(4).fill('gooddata'),
    };
  },
  watch: {
    safecode: function see() {
      this.safecode = this.safecode.replace(/[^\d]/g, '');
    },
    credit: function dee() {
      this.credit = this.credit.replace(/[^\d ]/g, '');
    },
  },
  beforeCreate() {
    street.getLogin()
      .then(resl => {
        if (resl.data === 0) {
          this.$router.push({ name: 'member' });
        }
      })
      .catch(() => {
        this.$notify.error('error');
      });
  },
  mounted() {
    this.countCart();
    this.getCart();
    this.getMem();
  },
  methods: {
    addspace(e) {
      if ((this.credit.length + 1) % 5 === 0 && this.credit.length < 15 && e.key !== 'Backspace') {
        this.credit += ' ';
      }
    },
    countCart() {
      street.countCart()
        .then(resc => {
          this.cartNum = resc.data;
        })
        .catch();
    },
    getMem() {
      street.getLogin()
        .then(resl => {
          if (resl.data.length === 0) {
            this.$notify.warning(this.$t('loginfst'));
            this.$router.push({ name: 'login' });
          }
          if (resl.data !== 0) {
            this.user = resl.data;
          }
          if (this.user.suspended === 1) {
            this.$notify.error(this.$t('suspended'));
            this.$router.push({ name: 'shophome' });
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    getCart() {
      street.getCart()
        .then(res => {
          for (let i = 0; i < Object.keys(res.data).length - 1; i += 1) {
            this.$set(this.dataAll, i, res.data[i]);
          }
          this.dataAll.forEach(ele => {
            if (ele.stock < ele.amount) {
              this.over = true;
            }
          });
          this.total = 0;
          this.transcost = 0;
          this.dataAll.forEach(ele => {
            this.total += ele.price * ele.amount;
          });
          if (this.total < 1200) {
            this.total = this.total + 60;
            this.transcost = 60;
          }
          if (this.cartNum === 0) {
            this.total = 0;
            this.transcost = 0;
          }
        })
        .catch();
    },
    sameMem() {
      this.payname = this.user.name;
      this.payphone = this.user.phone;
      this.payaddr = this.user.address;
    },
    samePay() {
      this.getname = this.payname;
      this.getphone = this.payphone;
      this.getaddr = this.payaddr;
    },
    sendOrder(type) {
      if (this.cartNum === 0) {
        this.$notify.error('Cart is empty!');
        return false;
      }
      this.getMem();
      if (this.user.suspended === 1) {
        this.$notify.error(this.$t('suspended'));
        return false;
      }
      const namereg = /^[\u4e00-\u9fa5]*$/;
      const telRule = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      if (this.over) {
        this.$notify.error(this.$t('somenotenough'));
        return false;
      }
      let pass = true;
      if (type === 'a') {
        pass = this.checkbase(namereg, telRule);
      } else if (type === 'b') {
        pass = this.creditmore(namereg, telRule);
      }
      if (!pass) {
        this.$notify.error(this.$t('dataerr'));
        return false;
      }
      if (!this.agree) {
        this.$notify.error(this.$t('checkper'));
        this.$set(this.getcss, 3, 'baddata');
        return false;
      }

      if (type === 'a') {
        const atmorder = {
          payname: this.payname,
          payphone: this.payphone,
          payaddr: this.payaddr,
          getname: this.getname,
          getphone: this.getphone,
          getaddr: this.getaddr,
        };
        street.postNewAtmorder(atmorder)
          .then(res => {
            if (res.data) {
              this.$notify.success(this.$t('ordergoode'));
              this.clearCart();
            } else {
              this.$notify.error(this.$t('orderbad'));
            }
          })
          .catch();
      } else if (type === 'b') {
        const birm = this.birm.padStart(2, '0');
        const bird = this.bird.padStart(2, '0');
        const creditorder = {
          payname: this.payname,
          payphone: this.payphone,
          payaddr: this.payaddr,
          getname: this.getname,
          getphone: this.getphone,
          getaddr: this.getaddr,
          paygender: this.paygender,
          payidentity: this.payidentity,
          birth: `${this.biry}/${birm}/${bird}`,
          credit: this.credit.split(' ').join(''),
          validtime: `${this.validmonth}/${this.validyear}`,
          safecode: this.safecode,
        };
        street.postNewCreditorder(creditorder)
          .then(res => {
            if (res.data) {
              this.$notify.success(this.$t('ordergoode'));
              this.clearCart();
            } else {
              this.$notify.error(this.$t('orderbad'));
            }
          })
          .catch();
      }
      return true;
    },
    checkbase(namereg, telRule) {
      let pass = true;
      this.atmcss = new Array(3).fill('gooddata');
      this.getcss = new Array(4).fill('gooddata');
      if (this.payname.trim() === '' || this.payname.trim().search(namereg) === -1) {
        this.$set(this.atmcss, 0, 'baddata');
        pass = false;
      }
      if (this.payphone.trim() === '' || this.payphone.trim().search(telRule) === -1) {
        this.$set(this.atmcss, 1, 'baddata');
        pass = false;
      }
      if (this.payaddr.trim() === '') {
        this.$set(this.atmcss, 2, 'baddata');
        pass = false;
      }
      const passmore = this.lastgetcheck(pass, namereg, telRule) && pass;
      return passmore;
    },
    creditmore(namereg, telRule) {
      let pass = true;
      const identityreg = /^[A-Z]{1}[0-9]{9}$/;
      this.creditcss = new Array(9).fill('gooddata');
      this.getcss = new Array(4).fill('gooddata');
      if (this.payname.trim() === '' || this.payname.trim().search(namereg) === -1) {
        this.$set(this.creditcss, 0, 'baddata');
        pass = false;
      }
      if (this.payphone.trim() === '' || this.payphone.trim().search(telRule) === -1) {
        this.$set(this.creditcss, 4, 'baddata');
        pass = false;
      }
      if (this.payaddr.trim() === '') {
        this.$set(this.creditcss, 8, 'baddata');
        pass = false;
      }
      if (this.payidentity.trim() === '' || this.payidentity.trim().search(identityreg) === -1) {
        this.$set(this.creditcss, 2, 'baddata');
        pass = false;
      }
      if (this.biry.trim() === '' || this.birm.trim() === '' || this.bird.trim() === '' || parseInt(this.biry.trim(), 10) > 112 || parseInt(this.birm.trim(), 10) > 12 || parseInt(this.bird.trim(), 10) > 31) {
        this.$set(this.creditcss, 3, 'baddata');
        pass = false;
      }
      if (this.credit.trim() === '' || this.credit.trim().split(' ').join('').length !== 16) {
        this.$set(this.creditcss, 5, 'baddata');
        pass = false;
      }
      if (this.validmonth === '' || this.validyear === '') {
        this.$set(this.creditcss, 6, 'baddata');
        pass = false;
      }
      if (this.safecode.trim() === '') {
        this.$set(this.creditcss, 7, 'baddata');
        pass = false;
      }
      const passmore = this.lastgetcheck(pass, namereg, telRule) && pass;
      return passmore;
    },
    lastgetcheck(pass, namereg, telRule) {
      let passmore = pass;
      if (this.getname.trim() === '' || this.getname.trim().search(namereg) === -1) {
        this.$set(this.getcss, 0, 'baddata');
        passmore = false;
      }
      if (this.getphone.trim() === '' || this.getphone.trim().search(telRule) === -1) {
        this.$set(this.getcss, 1, 'baddata');
        passmore = false;
      }
      if (this.getaddr.trim() === '') {
        this.$set(this.getcss, 2, 'baddata');
        passmore = false;
      }
      return passmore;
    },
    clearCart() {
      street.clearCart()
        .then()
        .catch();
      this.$router.push({ name: 'orders' });
    },
  },
};
</script>
<style lang="scss" scoped>
.w30h30 {
  width: 30px;
  height: 30px;
  margin: 2px auto !important;
  object-fit: contain;
}

.tableWidth {
  margin-top: 10px;
  margin-bottom: 15px;
  width: 532px;
}

/deep/ .cell {
  height: 35px;
  margin: 0 auto !important;
  text-align: center;
}

/deep/ .cell>span {
  display: inline-block !important;
  margin-top: 6px !important;
}

/deep/ .el-table th>.cell {
  height: 25px !important;
}

/deep/ .el-table td {
  padding: 0px 0 !important;
}

/deep/ .el-table th {
  padding: 0px 0 !important;
}

.mycard {
  width: 610px;
  margin: 20px auto;
  padding: 0px 18px;
  border-radius: 20px;
  background-color: rgb(226, 226, 226);
}

.center {
  text-align: center;
}

.clicksame {
  cursor: pointer;
  color: rgb(17, 111, 113);
  text-decoration: underline;
}

.red {
  color: red;
}

.success {
  color: #4ab353 !important;
}

.baddata {
  color: red;
}


.gooddata {
  color: black;
}

/deep/ .el-radio__label {
  font-size: 10px;
  padding-left: 5px;
}

/deep/ .el-radio {
  margin-right: 15px;
}

/deep/ .el-radio__inner {
  border: 1px solid #3e3e3e;
}

/deep/ .el-input--small .el-input__inner {
  height: 22px;
}

.ml-20 {
  margin-left: 20px;
}

/deep/ .el-row {
  margin-top: 17px;
}

/deep/ .baddata>>.el-checkbox__label {
  color: red;
}

/deep/ .el-input__inner {
  padding: 0 8px;
}

/deep/ .el-input--small .el-input__icon {
  line-height: 22px;
}

.img {
  margin: 0 auto;
}

.w80 {
  width: 80px;
}

.w100 {
  width: 100px;
}

.w150 {
  width: 150px;
}

.w70 {
  width: 70px;
}

.w108 {
  width: 108px;
}

.w40 {
  width: 40px;
}

.w105 {
  width: 105px;
}

.w165 {
  width: 165px;
}

.w50 {
  width: 50px;
}

.w200 {
  width: 200px;
}

.mr5px {
  margin-right: 5px;
}

.mr20px {
  margin-right: 20px;
}
</style>
