<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  .mt-40
    el-table.tableWidth(:data="dataAll", border)
      el-table-column(label="User_id", width="80px")
        template(slot-scope="scope")
          span {{ scope.row.user_id }}
      el-table-column(label="Name", width="100px")
        template(slot-scope="scope")
          span {{ scope.row.name }}
      el-table-column(label="Email", width="220px")
        template(slot-scope="scope")
          span {{ scope.row.email }}
      el-table-column(label="Activation", width="170px")
        template(slot-scope="scope")
          el-radio-group.ml-4(v-model="scope.row.activation", @change="activeChange(scope.row.user_id, scope.row.activation)")
            el-radio(:label="1", size="small") {{ $t('active') }}
            el-radio(:label="0", size="small") {{ $t('stopact') }}
      el-table-column(label="Suspended", width="100px")
        template(slot-scope="scope")
          el-checkbox(v-model="scope.row.suspended", :label="$t('suspend')", size="large", @change="suspend(scope.row.user_id, scope.row.suspended)")
</template>

<script>
import shop from '~/api/shop';

export default {
  name: 'backMember',
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
    this.getAllUser();
  },
  methods: {
    getAllUser() {
      shop.getAllUser()
        .then(res => {
          this.dataAll = res.data;
          this.dataAll.forEach((ele, key) => {
            if (ele.suspended === 1) {
              this.dataAll[key].suspended = true;
            } else {
              this.dataAll[key].suspended = false;
            }
          });
        })
        .catch();
    },
    activeChange(uid, active) {
      shop.updateUserActive(uid, active)
        .then(res => {
          if (res.data === 1) {
            this.$notify.success(this.$t('active'));
          } else {
            this.$notify.warning(this.$t('stopact'));
          }
        })
        .catch();
    },
    suspend(uid, sus) {
      shop.updateUserSuspend(uid, sus)
        .then(res => {
          if (res.data === 1) {
            this.$notify.error(this.$t('suspendstart'));
          } else {
            this.$notify.success(this.$t('stopsuspend'));
          }
        })
        .catch();
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
  width: 670px;
}

.mt-40 {
  margin-top: 40px;
}
</style>
