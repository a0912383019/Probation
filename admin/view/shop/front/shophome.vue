<template lang="pug">
  div
    front-nav(:cartnum="cartNum")
    div
      el-tabs.demo-tabs(v-model="nowCate", type="card", @tab-click="handleClick")
        el-tab-pane(:key="'All'", label="All", name="All")
        template(v-for="item in cate")
          el-tab-pane(:key="item.category_id.toString()", :label="item.category", :name="item.category_id.toString()")
    div(v-if="nowCate !== 'All'")
      el-tabs.demo-tabs(v-model="nowItem", type="card", @tab-click="handleClicktwo")
        el-tab-pane(:key="'All'", label="All", name="All")
        template(v-for="item in items")
          el-tab-pane(:key="item.item_id.toString()", :label="item.item", :name="item.item_id.toString()")
    div
      el-row.w1000m10auto(:gutter="60")
        el-col(v-for="item in procs", :key="item.id", :span="8")
          el-card.p0mt30(@click.native="procDetail(item.proc_id)")
            img.imageuu(:src="item.pic1")
            .p10center
              h3.m5auto {{ item.proc_name }}
              el-button.m8auto(v-if="item.tf === 1", type="danger", plain, @click.stop="addtocart(item.stock_id, item.proc_id, item.price, item.pic1, item.proc_name)") ADD TO CART
              el-button.m8auto(v-else, type="success", plain) SEE DETAILS
        el-col
          .pagination
            el-pagination(background, layout="prev, pager, next", :current-page="tablePage.pageNum", :page-size="tablePage.pageSize", :total="tablePage.total", @current-change="handlePageChange")

</template>

<script>
import frontNav from '../components/frontNav';
import street from '~/api/street';

export default {
  name: 'shopHome',
  components: {
    frontNav,
  },
  data() {
    return {
      cate: [],
      nowCate: this.$route.query.cate === undefined ? 'All' : this.$route.query.cate,
      items: [],
      nowItem: this.$route.query.item === undefined ? 'All' : this.$route.query.item,
      procs: [],
      cartNum: 0,
      showButton: [],
      tablePage: {
        pageNum: 1, // 第幾頁
        pageSize: 6, // 每頁幾筆
        total: 0, // 總筆數
      },
    };
  },
  watch: {
    nowCate: function cateChange() {
      if (this.nowCate !== 'All') {
        this.getItem();
      }
    },
  },
  mounted() {
    street.getCate()
      .then(resq => {
        this.cate = resq.data;
      })
      .catch();
    this.getItem();
    this.getProcs(this.nowCate, this.nowItem, this.tablePage.pageNum, this.tablePage.pageSize);
    this.countCart();
  },
  methods: {
    handleClick(tab) {
      this.tablePage.pageNum = 1;
      this.nowCate = tab.$vnode.key.toString();
      this.nowItem = 'All';
      this.getProcs(this.nowCate, this.nowItem, this.tablePage.pageNum, this.tablePage.pageSize);
      this.$router.push({ name: 'shophome', query: { cate: tab.$vnode.key } })
        .catch(err => err);
    },
    handleClicktwo(tab) {
      this.tablePage.pageNum = 1;
      this.nowItem = tab.$vnode.key.toString();
      this.getProcs(this.nowCate, this.nowItem, this.tablePage.pageNum, this.tablePage.pageSize);
      this.$router.push({ name: 'shophome', query: { cate: this.nowCate, item: tab.$vnode.key } })
        .catch(err => err);
    },
    getItem() {
      street.getItem(this.nowCate)
        .then(resn => {
          this.items = resn.data;
        })
        .catch();
    },
    handlePageChange(currentPage) {
      this.tablePage.pageNum = currentPage;
      this.getProcs(this.nowCate, this.nowItem, this.tablePage.pageNum, this.tablePage.pageSize);
    },
    getProcs(cate, item, page, per) {
      street.getProcs(cate, item, page, per)
        .then(rese => {
          this.procs = rese.data;
          delete this.procs.response_code;
        })
        .catch();
      this.getTotalPage(cate, item);
    },
    getTotalPage(cate, item) {
      street.getTotalPage(cate, item)
        .then(res => {
          this.tablePage.total = res.data;
        })
        .catch();
    },
    procDetail(procid) {
      this.$router.push({ name: 'procdetails', query: { procid } });
    },
    addtocart(iSid, sProcid, iPrice, pic1, name) {
      street.postAddCart(iSid, sProcid, 1, iPrice, pic1, name)
        .then(resa => {
          this.$notify.success('Add success !');
          this.cartNum = resa.data;
        })
        .catch();
      return true;
    },
    countCart() {
      street.countCart()
        .then(resc => {
          this.cartNum = resc.data;
        })
        .catch();
    },
  },
};
</script>
<style lang="scss" scoped>
.w100 {
  width: 100px;
}

.imageuu {
  width: 211px;
  height: 211px;
  display: block;
  object-fit: contain;
}

/deep/ .el-card__body {
  padding: 30px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 50px;
}

/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: rgb(221, 45, 45);
}

.w1000m10auto {
  width: 1000px !important;
  margin: 10px auto !important;
}

.p0mt30 {
  padding: 0px;
  margin-top: 30px;
}

.p10center {
  padding: 10px;
  text-align: center;
}

.m5auto {
  margin: 5px auto;
}

.m8auto {
  margin: 8px auto 0 auto;
}
</style>
