<?php

namespace App\Model\NewShop;

use App\Model\Model;

class Payment extends Model
{
    protected $table = 'Payment';
    public $primaryKey = ['id'];
    public $incrementing = false;
    public $timestamps = false;

    ##可以儲存的欄位
    protected $fillable = [
      'payment_id',
      'method',
    ];

    protected $casts = [
      'payment_id' => 'integer',
      'method' => 'string',
    ];
}
