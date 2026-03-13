<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrameConfig extends Model
{
    protected $table = 'frame_config';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
}
