<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  div
    front-nav(:cartnum="cartNum")
    .cont
      el-form.member(:model="user", center)
        el-form-item(label="Name", :label-width="formLabelWidth")
          el-input(v-model="user.name", :disabled="otherChange", autocomplete="off", size="small")
        el-form-item(label="Email", :label-width="formLabelWidth")
          el-input(v-model="user.email", :disabled="otherChange", autocomplete="off", size="small")
        el-form-item(v-show="pwChange", label="Password", :label-width="formLabelWidth")
          el-input(v-model="user.pw", type="password", :disabled="pwChange", autocomplete="off", size="small")
        el-form-item(v-show="!pwChange", label="Old Password", :label-width="formLabelWidth")
          el-input(v-model="user.oldpw", type="password", autocomplete="off", size="small")
        el-form-item(v-show="!pwChange", label="New Password", :label-width="formLabelWidth")
          el-input(v-model="user.newpw", type="password", autocomplete="off", size="small")
        el-form-item(v-show="!pwChange", label="again", :label-width="formLabelWidth")
          el-input(v-model="user.pwagain", type="password", autocomplete="off", size="small")
        el-form-item(label="Address", :label-width="formLabelWidth")
          el-input(v-model="user.address", :disabled="otherChange", autocomplete="off", size="small")
        el-form-item(label="Phone", :label-width="formLabelWidth")
          el-input(v-model="user.phone", :disabled="otherChange", autocomplete="off", size="small", placeholder="xxx-xxx-xxxx")
        el-form-item
          span.dialog-footer(v-show="!datachanging")
            rd-button.letter-space-sm(@click="changePW") {{ $t('Change PW') }}
            rd-button.letter-space-sm(type="primary", @click="changeOther") {{ $t('Change Other') }}
          span.dialog-footer(v-show="datachanging")
            rd-button.letter-space-sm(@click="save") {{ $t('Save') }}
            rd-button.letter-space-sm(type="primary", @click="cancel") {{ $t('Cancel') }}
</template>

<script>
import frontNav from '../components/frontNav';
import street from '~/api/street';

export default {
  name: 'memData',
  components: {
    frontNav,
  },
  data() {
    return {
      formLabelWidth: '120px',
      isLogin: false,
      user: {
        name: '',
        email: '',
        pw: '',
        oldpw: '',
        newpw: '',
        pwagain: '',
        address: '',
        phone: '',
      },
      otherChange: true,
      pwChange: true,
      datachanging: false,
      cartNum: 0,
    };
  },
  created() {
    this.getLogin();
  },
  mounted() {
    this.countCart();
  },
  methods: {
    changePW() {
      this.pwChange = false;
      this.datachanging = true;
    },
    changeOther() {
      this.otherChange = false;
      this.datachanging = true;
    },
    cancel() {
      this.getLogin();
      this.datachanging = false;
      this.pwChange = true;
      this.otherChange = true;
    },
    save() {
      if (!this.pwChange) {
        street.updateUserPw(this.user.email, this.user.oldpw, this.user.newpw, this.user.pwagain)
          .then(resp => {
            if (resp.data === 'pwsuccess') {
              this.$notify.success(this.$t(resp.data));
              this.pwChange = true;
              this.datachanging = false;
              this.user.oldpw = '';
              this.user.newpw = '';
              this.user.pwagain = '';
            } else {
              this.$notify.error(this.$t(resp.data));
            }
          })
          .catch(() => {
            this.$notify.error('error');
          });
      } else {
        street.updateUserOther(this.user.name.trim(), this.user.email.trim(), this.user.address.trim(), this.user.phone.trim(), this.user.user_id)
          .then(rest => {
            if (rest.data === 'updatesuccess') {
              this.$notify.success(this.$t(rest.data));
              this.getLogin();
              this.otherChange = true;
              this.datachanging = false;
            } else {
              this.$notify.error(this.$t(rest.data));
            }
          })
          .catch(() => {
            this.$notify.error('error');
          });
      }
    },
    getLogin() {
      street.getLogin()
        .then(resl => {
          if (resl.data.length !== 0) {
            this.user = resl.data;
            this.user.pw = 'xxxxxxxxxx';
            this.isLogin = true;
          } else {
            this.$router.push({ name: 'login' });
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
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

.wid100per {
  width: 100%;
}

.mt-20 {
  margin-top: 20px;
}

/deep/ .el-dialog__body .el-input {
  width: 220px !important;
}

/deep/ .member .el-input {
  width: 220px !important;
}

/deep/ .member .el-form-item__label {
  color: white;
}

.bread {
  width: 150px;
  margin: 10px auto;
  text-align: center;
}

/deep/ .el-breadcrumb__inner.is-link {
  color: rgb(30, 74, 60);
}

/deep/ .el-breadcrumb__inner.is-link:hover {
  color: rgb(61, 144, 118);
}

.cont {
  text-align: center;
  padding-top: 40px;
  width: 450px;
  margin: 40px auto;
  border: 1px solid black;
  background-color: grey;
}
</style>
