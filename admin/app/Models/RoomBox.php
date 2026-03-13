<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomBox extends Model
{
    protected $table = 'room_box';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = ['kode_room', 'name', 'is_running', 'status'];

    public function tickets()
    {
        return $this->hasMany(Tiket::class);
    }
}
