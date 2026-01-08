<?php

namespace App\Mail;

use App\BoutiqueRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BoutiqueRequestNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $boutiqueRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(BoutiqueRequest $boutiqueRequest)
    {
        $this->boutiqueRequest = $boutiqueRequest;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $adminPanelUrl = 'https://innosft.com/admin/dashboard';

        return $this->subject('Nouvelle demande d\'ouverture de boutique - Boutique UIDT')
                    ->view('emails.boutique-request-notification')
                    ->with([
                        'request' => $this->boutiqueRequest,
                        'adminPanelUrl' => $adminPanelUrl,
                    ]);
    }
}
