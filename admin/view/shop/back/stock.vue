<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  .w960
    el-row.topMtb(:gutter="20", type="flex", justify="left")
      el-col(:span="3")
        el-select.m-2(:popper-append-to-body="false", v-model="procid", placeholder="ProcID")
          el-option(v-for="(item, key) in allPid", :key="key", :label="item", :value="item")
      el-col(:span="3")
        el-select.m-2(:popper-append-to-body="false", v-model="specid", placeholder="Unit")
          el-option(v-for="(item, key) in relateSpec", :key="key", :label="item.unit", :value="item.spec_id")
      el-col(:span="3")
        el-select.m-2(:popper-append-to-body="false", v-model="sizeid", placeholder="Size")
          el-option(v-for="(item, key) in size", :key="key", :label="item.size", :value="item.size_id")
      el-col(:span="4")
        el-input.wid100per(v-model="SafeQuanity", type="number")
          template(#prepend)
            div Safe
      el-col(:span="4")
        el-input.wid100per(v-model="Stock", type="number")
          template(#prepend)
            div Stock
      el-col(:span="3")
        el-button(type="primary", @click.native="addNew()")
          span ADD
    el-table.w830(:data="stockData", border)
      el-table-column(label="ProcID", width="120px")
        template(slot-scope="scope")
          span {{ scope.row.proc_id}}
      el-table-column(label="Name", width="120px")
        template(slot-scope="scope")
          span {{ scope.row.proc_name}}
      el-table-column(label="Unit", width="120px")
        template(slot-scope="scope")
          span {{ scope.row.unit}}
      el-table-column(label="Size", width="120px")
        template(slot-scope="scope")
          span {{ scope.row.size}}
      el-table-column(label="SafeNum", width="120px")
        template(slot-scope="scope")
          span {{ scope.row.safe_num}}
      el-table-column(label="Stock", width="120px")
        template(slot-scope="scope")
          span {{ scope.row.stock}}
      el-table-column(label="OPERATIONS", width="110px")
        template(slot-scope="scope")
          el-button.ml-8(size="small", type="danger", @click="delRow(scope.row.stock_id)")
            span Delete
</template>

<script>
import shop from '~/api/shop';

export default {
  name: 'backStock',
  data() {
    return {
      dataTable: [],
      allPid: [],
      procid: '',
      allSpec: [],
      relateSpec: [],
      specid: '',
      selectProcCate: '',
      sizeid: '',
      size: [],
      SafeQuanity: '',
      Stock: '',
      stockData: [],
    };
  },
  watch: {
    procid: function getRelate() {
      this.specRelate();
    },
    selectProcCate: function setSpec() {
      this.specRelateSet();
    },
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/setKeepLoading', false);
    }, 500);
    shop.getProcid()
      .then(resp => {
        const vm = this;
        vm.allPid = resp.data;
        vm.procid = resp.data[0];
      });
    shop.getSpec()
      .then(ress => {
        this.allSpec = ress.data;
      })
      .catch(() => {
        this.$notify.error('error');
      });
    shop.getSize()
      .then(resz => {
        this.size = resz.data;
      })
      .catch(() => {
        this.$notify.error('error');
      });
    this.getAllStock();
  },
  methods: {
    addNew() {
      if (this.specid === '' || this.SafeQuanity.trim() === '' || this.Stock.trim() === '') {
        this.$notify.error(this.$t('datanotgood'));
        return;
      }
      shop.addNewStock(this.procid, this.specid, this.sizeid, this.SafeQuanity.trim(), this.Stock.trim())
        .then(resa => {
          if (resa.data === 1) {
            this.$notify.success(this.$t('addsuccess'));
          } else {
            this.$notify.success(this.$t('updatesuccess'));
          }
          this.specid = '';
          this.sizeid = '';
          this.SafeQuanity = '';
          this.Stock = '';
          this.getAllStock();
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    specRelate() {
      shop.procCate(this.procid)
        .then(resiii => {
          this.selectProcCate = resiii.data;
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    specRelateSet() {
      this.specid = '';
      this.relateSpec = this.allSpec.filter(ele => ele.category_id === this.selectProcCate.category_id);
    },
    getAllStock() {
      shop.getAllStock()
        .then(reso => {
          this.stockData = reso.data;
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    delRow(sid) {
      shop.delStock(sid)
        .then(resd => {
          if (resd.data === 1) {
            this.getAllStock();
            this.$notify.success(this.$t('delsuccess'));
          } else {
            this.$notify.error('error');
          }
        })
        .catch();
    },
  },
};
</script>
<style lang="scss" scoped>
.wid100per {
  min-width: 100%;
}

/deep/ .el-select-dropdown__list {
  padding: 0 0 0 0 !important;
  z-index: 10001 !important;
}

/deep/ .el-table .cell {
  overflow: visible;
}

.w100 {
  width: 100px;
}

.w170 {
  width: 170px;
}

.w830 {
  width: 830px;
}

.topMtb {
  margin-bottom: 30px;
  margin-top: 20px;
}

.ml-8 {
  margin-left: 8px;
}

.w960 {
  width: 960px;
}
</style>
