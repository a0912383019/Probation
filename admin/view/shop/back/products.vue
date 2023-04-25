<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  .mb-200
    el-button.mt-20(type="primary", @click="showDialog = true") ADD NEW PRODUCT
    el-dialog.wordspace-2(:visible.sync="showDialog", title="NEW PRODUCT", :width="'620px'", center)
      el-form.addform.ml-15(:model="addForm", center)
        el-form-item(label="ProcId *", :label-width="formLabelWidth")
          el-input.ml-25(v-model="addForm.procid", autocomplete="off", size="small")
        el-form-item(label="Category *", :label-width="formLabelWidth")
          .w220
            el-select.ml-25(v-model="addForm.cid", :popper-append-to-body="false", filterable, size="small")
              el-option(v-for="(item, key) in cateOption", :key="key", :label="item.category", :value="item.category_id")
        el-form-item(label="Item *", :label-width="formLabelWidth")
          .w220
            el-select.ml-25(v-model="addForm.itid", :popper-append-to-body="false", filterable, size="small")
              el-option(v-for="(item, key) in itemOptionRelativeCateOption", :key="key", :label="item.item", :value="item.item_id")
        el-form-item(label="Product Name *", :label-width="formLabelWidth")
          el-input.ml-25(v-model="addForm.procname", autocomplete="off", size="small")
        el-alert(type="info" center show-icon :closable="false")
          p Product Name can only be under 20 varchar
        el-form-item.mt20px(label="Photo *", :label-width="formLabelWidth")
          el-upload.upload-demo.ml-25(ref="uploadPhoto", :auto-upload="false", :http-request="uploadSectionFile", action="/hex/shop/uploadPhoto", :on-change="onChange", list-type="picture")
            el-button(type="primary", size="small") Upload Photo
            template(#tip)
              div(class="el-upload__tip") jpg/png files with a size less than 200kb
        el-form-item(label="Introduction *", :label-width="formLabelWidth")
          el-input.ml-25(v-model="addForm.describe", autocomplete="off", size="small", type="textarea")
        el-form-item(label="Price *", :label-width="formLabelWidth")
          el-input.ml-25(v-model="addForm.price", type="number", autocomplete="off", size="small")
      template(#footer)
        span.dialog-footer
          rd-button.letter-space-sm(@click="showDialog = false") {{ $t('Cancel') }}
          rd-button.letter-space-sm(type="primary", @click="addNewProc()") {{ $t('Confirm') }}
      el-alert(type="info" center show-icon :closable="false")
        p *為必填欄位
    el-table.tableWidth(:data="dataAll", border)
      el-table-column(label="Img", width="80px")
        template(slot-scope="scope")
          img.w50h50(:src="scope.row.pic1")
      el-table-column(label="PID", width="70px")
        template(slot-scope="scope")
          span {{ scope.row.proc_id }}
      el-table-column(label="Name", width="100px")
        template(slot-scope="scope")
          span {{ scope.row.proc_name }}
      el-table-column(label="Cat", width="90px")
        template(slot-scope="scope")
          span {{ scope.row.category }}
      el-table-column(label="Item", width="90px")
        template(slot-scope="scope")
          span {{ scope.row.item }}
      el-table-column(label="Describe", width="150px")
        template(slot-scope="scope")
          span {{ scope.row.describe }}
      el-table-column(label="Size", width="70px")
        template(slot-scope="scope")
          span {{ scope.row.size }}
      el-table-column(label="Price", width="70px")
        template(slot-scope="scope")
          span {{ scope.row.price }}
      el-table-column(label="Createtime", width="170px")
        template(slot-scope="scope")
          span {{ scope.row.createtime }}
      el-table-column(label="Onstore", width="80px")
        template(slot-scope="scope")
          span.bgy(v-if="scope.row.onstore === 0") 下架中
          span.bgr(v-if="scope.row.onstore === 1") 上架中
      el-table-column(label="Stock", width="150px")
        template(slot-scope="scope")
          span.cred(v-if="scope.row.stock < scope.row.safe_num") {{ scope.row.stock }}
          span.cgreen(v-if="scope.row.stock >= scope.row.safe_num") {{ scope.row.stock }}
      el-table-column(width="100px")
        template(slot-scope="{row}")
          el-button(size="small", type="success", @click.native="onstore(row.id, row.onstore, row.stock)") Onstore
    .pagination
      template
        el-pagination(background, layout="prev, pager, next", :current-page="tablePage.pageNum", :page-size="tablePage.pageSize", :total="tablePage.total", @current-change="handlePageChange")
</template>

<script>
import axios from 'axios';
import shop from '~/api/shop';

export default {
  name: 'backProc',
  data() {
    return {
      showDialog: false,
      formLabelWidth: '170px',
      cateOption: [],
      itemOption: [],
      allPid: [],
      itemOptionRelativeCateOption: [],
      addForm: {
        procid: '',
        cid: '',
        itid: '',
        procname: '',
        describe: '',
        price: '',
      },
      dataAll: [],
      tablePage: {
        pageNum: 1, // 第幾頁
        pageSize: 7, // 每頁幾筆
        total: 0, // 總筆數
      },
    };
  },
  watch: {
    'addForm.cid': function relateCate() {
      this.itemRelate();
    },
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/setKeepLoading', false);
    }, 500);
    this.getProcid();
    this.getAllProc();
    shop.getCategory()
      .then(resc => {
        this.addForm.cid = resc.data[0].category_id;
        this.cateOption = resc.data;
      })
      .catch(() => {
        this.$notify.error('error');
      });
    shop.getItem()
      .then(resi => {
        this.addForm.itid = resi.data[0].item_id;
        this.itemOption = resi.data;
        this.itemRelate();
      })
      .catch(() => {
        this.$notify.error('error');
      });
  },
  methods: {
    handlePageChange(currentPage) {
      this.tablePage.pageNum = currentPage;
      this.getAllProc();
    },
    itemRelate() {
      this.itemOptionRelativeCateOption = this.itemOption.filter(ele => ele.category_id === this.addForm.cid);
      if (this.itemOptionRelativeCateOption.length === 0) {
        this.addForm.itid = '';
      }
      if (this.itemOptionRelativeCateOption.length !== 0) {
        this.addForm.itid = this.itemOptionRelativeCateOption[0].item_id;
      }
    },
    // form submit to controller
    uploadSectionFile(param) {
      const fileObj = param.file;
      const form = new FormData();
      form.append('image', fileObj);
      form.append('procid', this.addForm.procid);
      form.append('cid', this.addForm.cid);
      form.append('itid', this.addForm.itid);
      form.append('procname', this.addForm.procname);
      form.append('describe', this.addForm.describe);
      form.append('price', this.addForm.price);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      axios.post('/hex/shop/uploadPhoto', form, config)
        .then(res => {
          if (res.data === 1) {
            // 清空dailog
            const keys = Object.keys(this.addForm);
            keys.forEach(ele => {
              if (ele !== 'cid' && ele !== 'itid') {
                this.addForm[ele] = '';
              }
            });
            this.getProcid();
            this.getAllProc();
            this.$refs.uploadPhoto.clearFiles();
            this.$notify.success(this.$t('addsuccess'));
          } else {
            this.$notify.error('error');
          }
        })
        .catch(err => this.$notify.error(err));
    },
    onChange(file, fileList) {
      // 限制上傳的類型
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
        this.$notify.error('請上傳jpg或是png檔案');
        // 把新上傳的錯誤檔案刪除
        fileList.splice(fileList.length - 1, 1);
        return false;
      }
      // 限制圖片上傳大小
      const fileSize = file.size / 1024;
      if (fileSize > 200) {
        this.$notify.error('上傳圖片請勿超過200Kb');
        fileList.splice(fileList.length - 1, 1);
        return false;
      }
      // 只留下新的一張
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      return true;
    },
    addNewProc() {
      // 判斷是否有空白值
      const asArray = Object.entries(this.addForm);
      const hasEmpty = asArray.filter(ele => {
        const itemType = (typeof ele[1] === 'string' || 'number');
        const item = itemType ? ele[1].toString().trim() : '';
        return item === '';
      });
      if (hasEmpty.length > 0) {
        this.$notify.error(this.$t('nowhite'));
        return false;
      }
      // 判斷ＰＩＤ是否重複
      if (this.allPid.includes(this.addForm.procid)) {
        this.$notify.error(this.$t('procidrepeat'));
        return false;
      }
      // 判斷是否有上傳圖片
      if (this.$refs.uploadPhoto.uploadFiles.length === 0) {
        this.$notify.error(this.$t('uploadpic'));
        return false;
      }
      this.$refs.uploadPhoto.submit();
      return true;
    },
    getProcid() {
      // 取得所有proc_id
      shop.getProcid()
        .then(resp => {
          const vm = this;
          vm.allPid = resp.data;
        });
    },
    getAllProc() {
      shop.getAllProc(this.tablePage.pageNum, this.tablePage.pageSize)
        .then(resd => {
          this.dataAll = resd.data;
          this.getTotalPage();
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    getTotalPage() {
      shop.getTotalPage()
        .then(res => {
          this.tablePage.total = res.data;
        })
        .catch();
    },
    onstore(id, onstore, stock) {
      if (stock === null) {
        this.$notify.warning(this.$t('stockfst'));
        return false;
      }
      shop.onstore(id, onstore)
        .then(resp => {
          if (resp === 'false') {
            this.$notify.error('error');
          }
          const vm = this;
          vm.getAllProc();
        });
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.letter-space-sm {
  letter-spacing: 0.1rem;
}

/deep/ .el-input {
  width: 220px !important;
}

/deep/ .el-select-dropdown__list {
  padding: 0 0 0 0 !important;
  letter-spacing: 1px;
}

/deep/ .el-form-item {
  margin-bottom: 8px;
}

/deep/ .el-upload-list__item {
  width: 70%;
  margin-bottom: 20px;
}

/deep/ .el-table td, .el-table th {
  text-align: center;
}

.tableWidth {
  margin-top: 20px;
  max-width: 1220px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 50px;
}

.w50h50 {
  width: 50px;
  height: 50px;
  margin: auto;
  object-fit: contain;
}

.mt-20 {
  margin-top: 20px;
}

.wordspace-2 {
  letter-spacing: .2rem;
}

.ml-15 {
  margin-left: 15px;
}

.ml-25 {
  margin-left: 25px;
}

.w220 {
  width: 220px;
}

.bgr {
  color: rgb(255, 255, 255);
  background-color: rgb(44, 126, 184);
}

.bgy {
  color: rgb(80, 191, 234);
  background-color: rgb(255, 255, 255);
}

.cred {
  color: red;
}

.cgreen {
  color: rgb(53, 207, 53);
}

.mt20px {
  margin-top: 12px;
}

/deep/ .el-textarea__inner {
  width: 70%;
}
</style>
