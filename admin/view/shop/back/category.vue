<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  table-edit(:dataAll="dataTable", :tableWidth="tableWidth", @addData="addNew", @newData="updateData", @delData="deleteData")
    template(slot="addData")
      el-col(:span="4")
        el-input.wid100per(v-model="cateid", type="number")
          template(#prepend)
            div Id
      el-col(:span="6")
        el-input.wid100per(v-model="cate", type="text")
          template(#prepend)
            div Category
    template(slot="dataCol")
      el-table-column(label="ID", width="95px")
        template(slot-scope="scope")
          input.w70(v-show="scope.row.iseditor", v-model="scope.row.category_id", type="number")
          span(v-show="!scope.row.iseditor") {{ scope.row.category_id }}
      el-table-column(label="CATEGORY", width="215px")
        template(slot-scope="scope")
          input.w170(v-show="scope.row.iseditor", v-model="scope.row.category", type="text")
          span(v-show="!scope.row.iseditor") {{ scope.row.category }}
</template>

<script>
import tableEdit from '../components/tableEdit';
import shop from '~/api/shop';

export default {
  name: 'backCate',
  components: {
    tableEdit,
  },
  data() {
    return {
      dataTable: [],
      tableWidth: 'w480',
      cateid: '',
      cate: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/setKeepLoading', false);
    }, 500);
    shop.getCategory()
      .then(res => {
        this.dataTable = res.data;
        this.dataTable = this.dataTable.map(row => ({
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
      if (this.cate.trim() === '' || this.cateid.trim() === '') {
        this.$notify.error(this.$t('nowhite'));
        return;
      }
      shop.addNewCate(this.cateid, this.cate)
        .then(res => {
          // 資料庫新增成功的話更新畫面表格
          if (res.data === 1) {
            shop.getCategory()
              .then(resi => {
                this.$notify.success(this.$t('addsuccess'));
                this.cateid = '';
                this.cate = '';
                this.dataTable = resi.data;
                this.dataTable = this.dataTable.map(row => ({
                  ...row,
                  iseditor: false,
                }));
              })
              .catch(() => {
                this.$notify.error('error');
              });
          } else {
            this.$notify.warning(this.$t('datarepeat'));
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    updateData(newData) {
      const iId = newData.id;
      const iCateid = newData.category_id;
      const sCate = newData.category;
      shop.updateCate(iCateid, sCate, iId)
        .then(res => {
          if (res.data === 1) {
            this.$notify.success(this.$t('updatesuccess'));
          } else {
            this.$notify.info(this.$t('nochange'));
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    deleteData(row, idx) {
      shop.deleteCate(row.id)
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
  },
};
</script>
<style lang="scss" scoped>
.wid100per {
  width: 100%;
}

.w70 {
  width: 70px;
}

.w170 {
  width: 170px;
}
</style>
