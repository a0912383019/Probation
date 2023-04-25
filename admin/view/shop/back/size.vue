<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  table-edit(:dataAll="dataTable", :tableWidth="tableWidth", @addData="addNew", @newData="updateData", @delData="deleteData")
    template(slot="addData")
      el-col(:span="5")
        el-input(v-model="size", type="text")
          template(#prepend)
            div Size
    template(slot="dataCol")
      el-table-column(label="SIZE", width="120px")
        template(slot-scope="scope")
          input.w80(v-show="scope.row.iseditor", v-model="scope.row.size", type="text")
          span(v-show="!scope.row.iseditor") {{ scope.row.size }}
</template>

<script>
import tableEdit from '../components/tableEdit';
import shop from '~/api/shop';

export default {
  name: 'backSize',
  components: {
    tableEdit,
  },
  data() {
    return {
      dataTable: [],
      tableWidth: 'w280',
      size: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/setKeepLoading', false);
    }, 500);
    shop.getSize()
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
      if (this.size.trim() === '') {
        this.$notify.error(this.$t('nowhite'));
        return;
      }
      shop.addNewSize(this.size)
        .then(res => {
          // 資料庫新增成功的話更新畫面表格
          if (res.data === 1) {
            shop.getSize()
              .then(resi => {
                this.$notify.success(this.$t('addsuccess'));
                this.size = '';
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
      const iId = newData.size_id;
      const sSize = newData.size;
      shop.updateSize(sSize, iId)
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
      shop.deleteSize(row.size_id)
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

.w80 {
  width: 80px;
}

.w170 {
  width: 170px;
}
</style>
