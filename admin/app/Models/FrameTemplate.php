<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrameTemplate extends Model
{
    protected $table = 'frame_template';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
}
