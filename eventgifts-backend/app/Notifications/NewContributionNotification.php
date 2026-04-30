<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewContributionNotification extends Notification
{
    use Queueable;

    protected $contribution;
    protected $itemName;
    protected $amount;

    /**
     * Create a new notification instance.
     */
    public function __construct($contribution, $itemName, $amount)
    {
        $this->contribution = $contribution;
        $this->itemName = $itemName;
        $this->amount = $amount;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'contribution_id' => $this->contribution->id,
            'item_name' => $this->itemName,
            'amount' => $this->amount,
            'message' => 'A guest has pledged ' . number_format($this->amount, 2) . ' toward ' . $this->itemName,
            'type' => 'contribution'
        ];
    }
}
