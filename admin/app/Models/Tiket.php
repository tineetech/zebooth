<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tiket extends Model
{
    protected $table = 'tiket';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'frame_config_id',
        'room_box_id',
        'ticket_code',
        'client_name',
        'session_time',
        'payment',
        'status_payment',
        'status',
        'frame_template_id',
    ];

    /**
     * Auto generate ticket code
     */
    protected static function booted()
    {
        static::creating(function (Tiket $ticket) {
            if (empty($ticket->ticket_code)) {
                $ticket->ticket_code = strtoupper(Str::random(4) . '-' . Str::random(4));
            }

            if (empty($ticket->status)) {
                $ticket->status = 'waiting';
            }

            if (is_null($ticket->status_payment)) {
                $ticket->status_payment = 0;
            }
        });
    }

    public function roomBox()
    {
        return $this->belongsTo(RoomBox::class);
    }

    public function frameConfig()
    {
        return $this->belongsTo(FrameConfig::class);
    }

    public function frameTemplate()
    {
        return $this->belongsTo(FrameTemplate::class);
    }

    /**
     * QR value accessor
     */
    public function getQrValueAttribute()
    {
        return $this->ticket_code;
    }
}
