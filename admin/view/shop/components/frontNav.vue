<template>
  <div class="container">
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      router
    >
      <template v-for="item in navs">
        <el-menu-item v-show="item.showL" :key="item.url" :index="item.url">
          {{ item.label }}
        </el-menu-item>
      </template>
      <el-submenu v-show="showM" index="2">
        <template #title>
          Member
        </template>
        <template v-for="item in member">
          <el-menu-item :key="item.url" :index="item.url">
            {{ item.label }}
          </el-menu-item>
        </template>
      </el-submenu>
      <el-button v-show="showM" class="btnm10" @click="logout">
        <span>Logout</span>
      </el-button>
      <div class="frcont">
        <el-button
          type="warning"
          size="small"
          plain
          @click="goCart"
        >
          <div class="cartnum">
            {{ cartnum }}
          </div>
          Cart
        </el-button>
      </div>
    </el-menu>
  </div>
</template>

<script>
import street from '~/api/street';

export default {
  name: 'frontNav',
  props: {
    cartnum: Number,
  },
  data() {
    return {
      navs: [
        {
          name: 'shopHome',
          label: this.$t('ShopHome'),
          url: '/shop/shophome',
          showL: true,
        },
        {
          name: 'login',
          label: this.$t('Login'),
          url: '/shop/shophome/login',
          showL: false,
        },
      ],
      member: [
        {
          name: 'account',
          label: this.$t('Acount'),
          url: '/shop/shophome/member/account',
        },
        {
          name: 'orders',
          label: this.$t('Orders'),
          url: '/shop/shophome/member/orders',
        },
      ],
      showM: false,
    };
  },
  mounted() {
    this.getLogin();
  },
  methods: {
    goCart() {
      this.$router.push({ name: 'cart' }).catch(() => { });
    },
    getLogin() {
      street.getLogin()
        .then(resl => {
          if (resl.data.length !== 0) {
            this.user = resl.data;
            this.navs[1].showL = false;
            this.showM = true;
          } else {
            this.navs[1].showL = true;
            this.showM = false;
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    logout() {
      street.Logout()
        .then()
        .catch(() => {
          this.$notify.error('error');
        });
      this.navs[1].showL = true;
      this.showM = false;
      if (this.$route.path.split('/')[3] === 'member') {
        this.$router.push({ name: 'login' }).catch(() => {});
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .cartnum {
  width: 25px;
  height: 16px;
  border-radius: 20px;
  background-color: rgb(158, 55, 15);
  color: white;
  display: inline-block;
  padding: 2px;
}

/deep/ .el-button--small,
.el-button--small.is-round {
  padding: 5px 10px;
}

.btnm10 {
  margin: 10px 10px;
}

.frcont {
  float: right;
  margin: 14px;
}
</style>
