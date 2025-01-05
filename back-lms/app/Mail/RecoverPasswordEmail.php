<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecoverPasswordEmail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public $token;

    public function __construct(User $user, string $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function build()
    {
        return $this->view('mails.recover', ['user' => $this->user, 'token' => $this->token, 'url' => env('APP_FRONT_URL')]);
    }
}
