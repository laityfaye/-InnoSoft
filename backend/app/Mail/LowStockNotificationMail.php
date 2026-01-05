<?php

namespace App\Mail;

use App\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LowStockNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $product;

    /**
     * Create a new message instance.
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('⚠️ Stock faible - ' . $this->product->name . ' - InnoSoft Creation')
                    ->view('emails.low-stock-notification')
                    ->with([
                        'product' => $this->product,
                    ]);
    }
}

