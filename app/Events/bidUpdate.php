<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Carbon\Carbon;

class bidUpdate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $price, $name, $auction, $session, $time;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($price, $name, $auction, $session, $time)
    {
        $this->price = $price;
        $this->name = $name;
        $this->auction = $auction;
        $this->session = $session;
        $this->time = $time;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('bid-channel');
    }

    public function broadcastAs()
    {
        return 'form-submit';
    }
}
