import http from '~/http/http';

export default {
  getPayment() {
    return http.get('/shop/getPayment');
  },
  addNewPay(iPayid, sMethod) {
    return http.post('/shop/addNew', { iPayid, sMethod });
  },
  updatePay(iPayid, sMethod, iId) {
    return http.post('/shop/updatePay', { iPayid, sMethod, iId });
  },
  deletePay(iId) {
    return http.delete('/shop/deletePay', { iId });
  },
};
