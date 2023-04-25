<?php
namespace App\Repository\NewShop;

use App\Model\NewShop\ShowAll as Model;

class NewShopR
{
  public function getSomething(Model $_oModel)
  {
    $data = $_oModel->get(['*']);
    return $data;
  }
}