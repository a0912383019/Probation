<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  table-edit(:dataAll="dataTable", :tableWidth="tableWidth", @addData="addNew", @newData="updateData", @delData="deleteData")
    template(slot="addData")
      el-col(:span="4")
        el-select(:popper-append-to-body="false", v-model="cateid", placeholder="Select")
          el-option(v-for="item in cateOption", :key="item.id", :label="item.category", :value="item.category_id")
      el-col(:span="6")
        el-input.wid100per(v-model="unit", type="text")
          template(#prepend)
            div Unit
    template(slot="dataCol")
      el-table-column(label="CATEGORY", width="120px")
        template(slot-scope="{row, $index}")
          el-select(transfer="true", :popper-append-to-body="false", v-show="row.iseditor", v-model="checkFloor[$index]")
            el-option(v-for="item in cateOption", :key="item.id", :label="item.category", :value="item.category_id")
          span(v-show="!row.iseditor") {{ row.category }}
      el-table-column(label="UNIT", width="230px")
        template(slot-scope="scope")
          input.w170(v-show="scope.row.iseditor", v-model="scope.row.unit", type="text")
          span(v-show="!scope.row.iseditor") {{ scope.row.unit }}
</template>

<script>
import tableEdit from '../components/tableEdit';
import shop from '~/api/shop';

export default {
  name: 'backSpec',
  components: {
    tableEdit,
  },
  data() {
    return {
      dataTable: [],
      cateOption: [],
      checkFloor: [],
      tableWidth: 'w520',
      cateid: '',
      unit: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/setKeepLoading', false);
    }, 500);
    this.getSpecTable();
    shop.getCategory()
      .then(resc => {
        this.cateOption = resc.data;
        this.cateOption = this.cateOption.map(row => ({
          ...row,
          iseditor: false,
        }));
        // for (let i = 0; i < this.dataTable.length; i += 1) {
        //   this.dataTable[i].iseditor = false;
        // }
      })
      .catch(() => {
        this.$notify.error('error');
      });
  },
  methods: {
    addNew() {
      if (this.unit.trim() === '' || this.cateid === '') {
        this.$notify.error(this.$t('nowhite'));
        return;
      }
      shop.addNewSpec(this.cateid, this.unit)
        .then(resa => {
          // 資料庫新增成功的話更新畫面表格
          if (resa.data === 1) {
            this.cateid = '';
            this.unit = '';
            this.$notify.success(this.$t('addsuccess'));
            this.getSpecTable();
          } else {
            this.$notify.warning(this.$t('datarepeat'));
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    updateData(newData, idx) {
      const iId = newData.spec_id;
      const iCateid = typeof this.checkFloor[idx] !== 'undefined' ? this.checkFloor[idx] : '';
      const sUnit = newData.unit;
      shop.updateSpec(iCateid, sUnit, iId)
        .then(resu => {
          if (resu.data === 1) {
            this.$notify.success(this.$t('updatesuccess'));
            this.getSpecTable();
          } else {
            this.$notify.info(this.$t('nochange'));
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    deleteData(row, idx) {
      shop.deleteSpec(row.spec_id)
        .then(resii => {
          if (resii.data === 1) {
            this.$notify.success(this.$t('delsuccess'));
            this.$delete(this.dataTable, idx);
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    getSpecTable() {
      shop.getSpec()
        .then(ress => {
          this.dataTable = ress.data;
          this.dataTable = this.dataTable.map(row => ({
            ...row,
            iseditor: false,
          }));
          for (let i = 0; i < this.dataTable.length; i += 1) {
            this.checkFloor[i] = this.dataTable[i].category_id;
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
.wid100per {
  width: 100%;
}

/deep/ .el-select-dropdown__list {
  padding: 0 0 0 0 !important;
}

/deep/ .el-table {
  overflow: visible !important;
}

/deep/ .el-table__body-wrapper {
  overflow: visible !important;
}

.w100 {
  width: 100px;
}

.w170 {
  width: 170px;
}
</style>
