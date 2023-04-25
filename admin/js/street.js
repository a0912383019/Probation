import http from '~/http/http';

export default {
  addNewUser(sName, sEmail, sPw, sAddr, sTel) {
    return http.post('/shop/addNewUser', {
      sName, sEmail, sPw, sAddr, sTel,
    });
  },
  postLogin(sAc, sPw) {
    return http.post('/shop/postLogin', {
      sAc, sPw,
    });
  },
  getLogin() {
    return http.get('/shop/getLogin');
  },
  Logout() {
    return http.get('/shop/Logout');
  },
  updateUserPw(sEm, sOpw, sNpw, sApw) {
    return http.put('/shop/updateUserPw', {
      sEm, sOpw, sNpw, sApw,
    });
  },
  updateUserOther(sName, sEmail, sAddress, sPhone, iUid) {
    return http.put('/shop/updateUserOther', {
      sName, sEmail, sAddress, sPhone, iUid,
    });
  },
  getCate() {
    return http.get('/shop/getCate');
  },
  getItem(iCid) {
    return http.get(`/shop/getItem/${iCid}`);
  },
  getProcs(iCid, iItid, iPage, iPer) {
    return http.get(`/shop/getProcs/${iCid}/${iItid}/${iPage}/${iPer}`);
  },
  countCart() {
    return http.get('/shop/countCart');
  },
  getThisProc(sProcid) {
    return http.get(`/shop/getThisProc/${sProcid}`);
  },
  getProcSize(sProcid) {
    return http.get(`/shop/getProcSize/${sProcid}`);
  },
  postAddCart(iSid, sProcid, iNum, iPrice, sPic1, sName) {
    return http.post('/shop/postAddCart', {
      iSid, sProcid, iNum, iPrice, sPic1, sName,
    });
  },
  getCart() {
    return http.get('/shop/getCart');
  },
  updateAmount(iAmount, iIdx) {
    return http.put('/shop/updateAmount', { iAmount, iIdx });
  },
  delCart(iIdx) {
    return http.delete(`/shop/delCart/${iIdx}`);
  },
  getPayment() {
    return http.get('/shop/getPayment');
  },
  getTrans() {
    return http.get('/shop/getTrans');
  },
  postNewAtmorder(atmorder) {
    return http.post('/shop/postNewAtmorder', { atmorder });
  },
  postNewCreditorder(creditorder) {
    return http.post('/shop/postNewCreditorder', { creditorder });
  },
  clearCart() {
    return http.delete('/shop/clearCart');
  },
  getper() {
    return http.get('/shop/getper');
  },
  getMemOrders() {
    return http.get('/shop/getMemOrders');
  },
  getTotalPage(iCid, iItid) {
    return http.get(`/shop/getTotalPage/${iCid}/${iItid}`);
  },
  getTot() {
    return http.get('/shop/getTot');
  },
};
