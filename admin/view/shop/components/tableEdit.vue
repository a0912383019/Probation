<i18n src="language/user/shopback.json"></i18n>
<template>
  <div>
    <el-row :gutter="20" class="topMtb">
      <slot name="addData"></slot>
      <el-col :span="2">
        <el-button type="primary" @click.native="addNew()">
          ADD
        </el-button>
      </el-col>
    </el-row>
    <div>
      <el-table :data="dataAll" border :class="tableWidth">
        <slot name="dataCol"></slot>
        <el-table-column label="OPERATIONS" width="170px">
          <template slot-scope="{row, $index}">
            <el-button size="small" @click.native="setEditMode(row, $index)">
              <span v-show="!row.iseditor">Edit</span>
              <span v-show="row.iseditor">Save</span>
            </el-button>
            <el-button size="small" type="danger" @click.native="delRow($index, row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 彈跳視窗 -->
    <rd-dialog
      width="300px"
      height="100px"
      :visible.sync="showDialog"
      class="diacont"
      @closed="disableBtn = false"
    >
      <div class="dialog__body">
        <h3>{{ $t('suredel') }}</h3>
      </div>
      <div slot="footer" class="dialog__footer">
        <rd-button @click="showDialog = false">
          {{ $t('cancel') }}
        </rd-button>
        <rd-button
          type="primary"
          :disabled="disableBtn"
          @click="delCheck()"
        >
          {{ $t('confirm') }}
        </rd-button>
      </div>
    </rd-dialog>
  </div>
</template>
<script>

export default {
  name: 'tableEdit',
  props: {
    dataAll: Array,
    tableWidth: String,
  },
  data() {
    return {
      showDialog: false,
      // 按鈕是否disable
      disableBtn: false,
      delObject: {},
      arrayIdx: '',
    };
  },
  methods: {
    // 觸發父組件function
    addNew() {
      this.$emit('addData');
    },
    setEditMode(row, idx) {
      const tableRow = row;
      if (tableRow.iseditor === false) {
        tableRow.iseditor = true;
      } else {
        this.$emit('newData', tableRow, idx);
        tableRow.iseditor = false;
      }
    },
    delCheck() {
      this.showDialog = false;
      // 要刪除的資料庫table row, 要刪除的array key
      this.$emit('delData', this.delObject, this.arrayIdx);
    },
    delRow(idx, row) {
      this.delObject = row;
      this.arrayIdx = idx;
      this.showDialog = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.w480 {
  width: 480px;
}

.w520 {
  width: 520px;
}

.w280 {
  width: 280px;
}

.topMtb {
  margin-bottom: 30px;
  margin-top: 20px;
}

/deep/ .el-table .cell {
  overflow: visible !important;
}

/deep/ .el-select-dropdown__list {
  overflow: visible !important;
  padding: 0 0 0 0 !important;
  z-index: 10001 !important;
}

.diacont {
  text-align: center;
  letter-spacing: .1rem;
}
</style>
