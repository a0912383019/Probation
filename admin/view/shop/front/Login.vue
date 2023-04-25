<i18n src="language/user/shopback.json"></i18n>
<template lang="pug">
  div
    front-nav(:cartnum="cartNum")
    .logincont
      template
        h2 Login
        el-form(label-position="right", label-width="150px")
          el-input.wid100per(v-model="account")
            template(#prepend)
              .w110 Account
          el-input.wid100per.mt-20(v-model="password", type="password")
            template(#prepend)
              .w110 Password
          .mt-20
            el-button
              span(@click="signIn") Sign In
            el-button(type="info", @click="showDialog = true")
              span Sign Up
      el-dialog.wordspace-2(:visible.sync="showDialog", title="Register", :width="'480px'", center)
        el-form.register.ml15(:model="register", center)
          el-form-item(label="Name *", :label-width="formLabelWidth")
            el-input.ml25(v-model="register.name", autocomplete="off", size="small")
          el-form-item(label="Email *", :label-width="formLabelWidth")
            el-input.ml25(v-model="register.email", autocomplete="off", size="small")
          el-form-item(label="Password *", :label-width="formLabelWidth")
            el-input.ml25(v-model="register.pw", type="password", autocomplete="off", size="small")
          el-form-item(label="again *", :label-width="formLabelWidth")
            el-input.ml25(v-model="register.pwagain", type="password", autocomplete="off", size="small")
          el-form-item(label="Address *", :label-width="formLabelWidth")
            el-input.ml25(v-model="register.address", autocomplete="off", size="small")
          el-form-item(label="Phone *", :label-width="formLabelWidth")
            el-input.ml25(v-model="register.phone", autocomplete="off", size="small", placeholder="xxx-xxx-xxxx")
          el-alert(type="info" show-icon :closable="false")
            p *為必填欄位
        template(#footer)
          span.dialog-footer
            rd-button.letter-space-sm(@click="showDialog= false") {{ $t('Cancel') }}
            rd-button.letter-space-sm(type="primary", @click="sendRegis") {{ $t('Register') }}
</template>

<script>
import frontNav from '../components/frontNav';
import street from '~/api/street';

export default {
  name: 'shopHome',
  components: {
    frontNav,
  },
  data() {
    return {
      account: '',
      password: '',
      showDialog: false,
      formLabelWidth: '120px',
      register: {
        name: '',
        email: '',
        pw: '',
        pwagain: '',
        address: '',
        phone: '',
      },
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
      cartNum: 0,
      isFromCart: this.$route.params.isFromCart,
    };
  },
  mounted() {
    this.getLogin();
    this.countCart();
  },
  methods: {
    sendRegis() {
      const checkNull = Object.entries(this.register).filter(item => item[1] === '');
      if (checkNull.length !== 0) {
        this.$notify.error(this.$t('nowhite'));
        return false;
      }
      const emailRule = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.[a-zA-Z]+$/;
      const pwRule = /^((?=.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+`\-={}[\]:";'<>?,./]))/;
      const telRule = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      if (this.register.email.search(emailRule) === -1) {
        this.$notify.error(this.$t('emformaterr'));
        return false;
      }
      if (this.register.pw.search(pwRule) === -1) {
        this.$notify.error(this.$t('rpwformaterr'));
        return false;
      }
      if (this.register.pw !== this.register.pwagain) {
        this.$notify.error(this.$t('pwnotsame'));
        return false;
      }
      if (this.register.phone.search(telRule) === -1) {
        this.$notify.error(this.$t('rtelformaterr'));
        return false;
      }
      street.addNewUser(this.register.name, this.register.email, this.register.pw, this.register.address, this.register.phone)
        .then(resc => {
          if (resc.data === 'usercreatesuccess') {
            this.$notify.success(this.$t(resc.data));
            //  清空dialog
            const keys = Object.keys(this.register);
            keys.forEach(ele => {
              this.register[ele] = '';
            });
            // 關閉dialog
            this.showDialog = false;
          } else {
            this.$notify.error(this.$t(resc.data));
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
      return true;
    },
    signIn() {
      street.postLogin(this.account, this.password)
        .then(resc => {
          if (resc.data === 1) {
            this.$notify.error(this.$t('accountstopped'));
          } else if (resc.data === 2) {
            this.$notify.success(this.$t('loginsuccess'));
            this.goWhere();
          } else {
            this.$notify.error(this.$t('empwerr'));
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    getLogin() {
      street.getLogin()
        .then(resl => {
          if (resl.data.length !== 0) {
            this.$router.push({ name: 'account' }).catch(() => {});
          }
        })
        .catch(() => {
          this.$notify.error('error');
        });
    },
    goWhere() {
      if (this.isFromCart === 'yes') {
        this.$router.push({ name: 'cart' }).catch(() => {});
      } else {
        this.$router.push({ name: 'account' }).catch(() => {});
      }
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
  width: 200px;
  margin: 10px auto;
  text-align: center;
}

.link {
  background-color: transparent;
  color: rgb(30, 74, 60);
  border-bottom: 0;
}

.link:hover {
  color: rgb(61, 144, 118);
}

.logincont {
  margin: 50px auto;
  width: 400px;
  text-align: center;
  background-color: yellow;
  padding: 20px;
}

.w110 {
  width: 110px;
}

.wordspace-2 {
  letter-spacing: .2rem;
}

.ml15 {
  margin-left: 15px;
}

.ml25 {
  margin-left: 25px;
}
</style>
