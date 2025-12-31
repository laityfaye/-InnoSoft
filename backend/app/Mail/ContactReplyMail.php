<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = 'Re: ' . ($this->data['subject'] ?? 'Réponse à votre message');
        
        return $this->subject($subject)
                    ->view('emails.contact-reply')
                    ->with([
                        'name' => $this->data['name'],
                        'subject' => $this->data['subject'] ?? 'Réponse à votre message',
                        'replyMessage' => $this->data['reply_message'],
                        'originalMessage' => $this->data['original_message'] ?? '',
                    ]);
    }
}
