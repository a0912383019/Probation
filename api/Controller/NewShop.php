<?php

namespace App\Http\Controllers\NewShop;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
// use App\Repository\NewShop\NewShopR;
use App\Model\NewShop\Payment;

class NewShop extends Controller
{
  public function getPayment(Payment $_oPayModel) {
    
    $aData = $_oPayModel->get();
    return $aData;
  }

  public function addNew(Request $_oRequest, Payment $_oPayModel) {
    
    $iPayment_Id = $_oRequest->input('iPayid');
    $sMethod = $_oRequest->input('sMethod');
    $iRes = $_oPayModel->insertOrIgnore(['payment_id' => $iPayment_Id, 'method' => $sMethod]);
    return $iRes;
  }

  public function updatePay(Request $_oRequest, Payment $_oPayModel) {
    $iPayment_Id = $_oRequest->input('iPayid');
    $sMethod = $_oRequest->input('sMethod');
    $iId = $_oRequest->input('iId');
    $iRes = $_oPayModel->where('id', $iId)->update(['payment_id' => $iPayment_Id, 'method' => $sMethod]);
    return $iRes;
  }

  public function deletePay(Request $_oRequest, Payment $_oPayModel) {
    $iId = $_oRequest->input('iId');
    // $iRes = $_oPayModel->where('id', $iId)->delete();
    return $iId;
  }
}
