<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  div
    front-nav(:cartnum="cartNum")
    .headtype
      img.imageii(:src="proc.pic1")
      .ibflmt50
        h5.greytext {{ proc.proc_id }}
        h2 {{ proc.proc_name }}

          span.frfs1mt8 $
            | {{ proc.price }}
        .desproc
          h3 {{ proc.describe }}
        div
          el-row.mt15(v-show="showsizebtn")
            el-button(v-for="(item, key) in sizebtn", :key="key", plain, :class="btnclass[key].class", @click="changebg(key, item.stock_id)") {{ item.size }}
          el-row
            .martm
              h3.flex-type {{ $t('amount') }}
              el-input-number(v-model="number", :min="1", :max="999", size="small")
            el-button.btnadd(text, @click="addtocart") ADD TO CART
</template>

<script>
import frontNav from '../components/frontNav';
import street from '~/api/street';

export default {
  name: 'procDetails',
  components: {
    frontNav,
  },
  data() {
    return {
      procid: this.$route.query.procid,
      proc: [],
      sizebtn: [],
      showsizebtn: false,
      number: 0,
      btnclass: [],
      buysSid: 0,
      cartNum: 0,
    };
  },
  watch: {
  },
  mounted() {
    this.getThisProc();
    this.countCart();
    this.getProcSize();
  },
  methods: {
    getThisProc() {
      street.getThisProc(this.procid)
        .then(res => {
          this.proc = res.data[0];
        })
        .catch();
    },
    countCart() {
      street.countCart()
        .then(resc => {
          this.cartNum = resc.data;
        })
        .catch();
    },
    getProcSize() {
      street.getProcSize(this.procid)
        .then(ress => {
          this.sizebtn = ress.data;
          for (let i = 0; i < this.sizebtn.length; i += 1) {
            this.btnclass[i] = { class: 'goon' };
          }
          this.showsizebtn = this.sizebtn[0].size !== null;
          if (this.sizebtn.length === 1) {
            this.buysSid = this.sizebtn[0].stock_id;
          }
        })
        .catch();
    },
    changebg(key, sid) {
      for (let i = 0; i < this.btnclass.length; i += 1) {
        this.$set(this.btnclass[i], 'class', 'goon');
      }
      this.btnclass.splice(key, 1, { class: 'foon' });
      this.buysSid = sid;
    },
    addtocart() {
      if (this.buysSid === 0) {
        this.$notify.error(this.$t('choosesize'));
        return false;
      }
      street.postAddCart(this.buysSid, this.proc.proc_id, this.number, this.proc.price, this.proc.pic1, this.proc.proc_name)
        .then(resa => {
          this.cartNum = resa.data;
        })
        .catch();
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.w100 {
  width: 100px;
}

.imageii {
  width: 300px;
  height: 300px;
  display: block;
  object-fit: contain;
  border: 4px solid rgb(27, 56, 79);
  float: left;
  margin: 50px 65px 50px 80px;
}

.greytext {
  opacity: 0.6;
  margin: 10px 0 0 0;
}

.headtype {
  width: 1000px;
  height: 420px;
  margin: 0 auto;
  background-color: rgb(162, 214, 230);
}

.desproc {
  width: 400px;
  height: 120px;
  background-color: rgb(0, 74, 112);
  color: white;
  padding: 20px;
  h3 {
    margin-top: 0;
  }
  overflow: auto;
}

.btnadd {
  margin-top: 20px;
  margin-bottom: 0px;
  float: right;
}

.flex-type {
  display: inline-flex;
}

.martm {
  margin-top: 15px;
  margin-bottom: 0px;
  float: left;
}

/deep/ .goon {
  background: rgb(255, 119, 0);
  border-color: rgb(238, 253, 255);
  color: black;
}

/deep/ .foon {
  background: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
}

/deep/ .el-button.is-plain:active {
  background: rgb(0, 0, 0);
  outline: 0;
}

/deep/ .el-button.is-plain:focus, .el-button.is-plain:hover {
  background: rgb(0, 0, 0);
  border-color: #409EFF;
  color: #409EFF;
}

.ibflmt50 {
  display: inline-block;
  float: left;
  margin-top: 50px;
}

.frfs1mt8 {
  float: right;
  font-size: 1rem;
  margin-top: 8px;
}

.mt15 {
  margin-top: 15px;
}
</style>
