<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    use HasFactory;

    protected $guarded = [];

    public $timestamps = false; 


    protected $dates = ['created_at']; // Ensure created_at is cast to a DateTime
}
