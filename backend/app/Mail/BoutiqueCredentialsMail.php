<?php

namespace App\Mail;

use App\Boutique;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BoutiqueCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $boutique;
    public $tempPassword;

    /**
     * Create a new message instance.
     */
    public function __construct(Boutique $boutique, string $tempPassword)
    {
        $this->boutique = $boutique;
        $this->tempPassword = $tempPassword;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $loginUrl = 'https://innosft.com/boutique/login';

        return $this->subject('Votre boutique a été approuvée - Identifiants temporaires')
                    ->view('emails.boutique-credentials')
                    ->with([
                        'boutique' => $this->boutique,
                        'tempPassword' => $this->tempPassword,
                        'loginUrl' => $loginUrl,
                    ]);
    }
}
