<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  .mt-40
    el-table.tableWidth(:data="dataAll", border)
      el-table-column(label="Order_ID", width="140px")
        template(slot-scope="scope")
          span.ahref(@click="goOrderDetails(scope.row.order_id)") {{ scope.row.order_id }}
      el-table-column(label="User_ID", width="80px")
        template(slot-scope="scope")
          span(:class="{'disableclass': scope.row.finished === 2}") {{ scope.row.user_id }}
      el-table-column(label="Name", width="90px")
        template(slot-scope="scope")
          span(:class="{'disableclass': scope.row.finished === 2}") {{ scope.row.name }}
      el-table-column(label="Order_Date", width="170px")
        template(slot-scope="scope")
          span(:class="{'disableclass': scope.row.finished === 2}") {{ scope.row.createtime }}
      el-table-column(label="Payment", width="90px")
        template(slot-scope="scope")
          span(:class="{'disableclass': scope.row.finished === 2}") {{ scope.row.pmethod }}
      el-table-column(label="Transport", width="90px")
        template(slot-scope="scope")
          span(:class="{'disableclass': scope.row.finished === 2}") {{ scope.row.tmethod }}
      el-table-column(label="Paid", width="90px")
        template(slot-scope="scope")
          el-checkbox(v-model="scope.row.paid", :disabled="scope.row.finished === 2", :label="$t('paid')", size="small", @change="isPaid(scope.row.id, scope.row.paid)")
      el-table-column(label="Delivery", width="260px")
        template(slot-scope="scope")
          el-radio-group.ml-4(v-model="scope.row.shipped", :disabled="scope.row.finished === 2", @change="isShipped(scope.row.id, scope.row.shipped)")
            el-radio(:label="0", size="small") {{ $t('noship') }}
            el-radio(:label="1", size="small") {{ $t('onship') }}
            el-radio(:label="2", size="small") {{ $t('shipped') }}
      el-table-column(label="Status", width="90px")
        template(slot-scope="scope")
          el-checkbox(v-model="scope.row.finished", :disabled="scope.row.finished === 2", :label="$t('finished')", size="small", @change="isFinished(scope.row.id, scope.row.finished)")
      el-table-column(width="110px")
        template(slot-scope="{row, $index}")
          el-button(type="primary", plain, :disabled="row.finished === 2", @click="canelOrder(row.id, $index)") Cancel

</template>

<script>
import shop from '~/api/shop';

export default {
  name: 'backOrders',
  data() {
    return {
      dataAll: [],
    };
  },
  watch: {
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/setKeepLoading', false);
    }, 500);
    this.getOrders();
  },
  methods: {
    getOrders() {
      shop.getOrders()
        .then(res => {
          this.dataAll = res.data;
          this.dataAll.forEach((ele, idx) => {
            if (ele.paid === 1) {
              this.dataAll[idx].paid = true;
            }
            if (ele.finished === 1) {
              this.dataAll[idx].finished = true;
            }
          });
        })
        .catch();
    },
    isPaid(id, pay) {
      shop.isPaid(id, pay)
        .then(() => {
          this.$notify.success(this.$t('paychangesuccess'));
        })
        .catch();
    },
    isShipped(id, shipped) {
      shop.isShipped(id, shipped)
        .then(() => {
          this.$notify.success(this.$t('shipchangesuccess'));
        })
        .catch();
    },
    isFinished(id, finished) {
      shop.isFinished(id, finished)
        .then(() => {
          this.$notify.success(this.$t('statuschanesuccess'));
        })
        .catch();
    },
    canelOrder(id, idx) {
      this.$confirm(this.$t('cancelsure'))
        .then(() => {
          shop.isFinished(id, 2)
            .then(() => {
              this.$notify.warning(this.$t('ordercancel'));
            })
            .catch();
          this.$set(this.dataAll[idx], 'finished', 2);
        })
        .catch(() => {});
    },
    goOrderDetails(oid) {
      const routeData = this.$router.resolve({ name: 'orderdetails', query: { oid } });
      window.open(routeData.href, '_blank');
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
  width: 1210px;
}

/deep/ .el-radio {
  margin-right: 14px;
}

/deep/ .el-radio__label {
  padding-left: 4px;
}

.disableclass {
  color: #C0C4CC;
}

.ahref {
  cursor: pointer;
  text-decoration: underline;
  color: rgb(30, 91, 94);
}

.ahref:hover {
  color: rgb(67, 151, 156);
}

.mt-40 {
  margin-top: 40px;
}
</style>
