<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrameTemplate extends Model
{
    protected $fillable = [
        'name',
        'category',
        'location',
        'createdAt',
    ];

    protected $table = 'frame_template';

    
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    
    public function frameConfig()
    {
        return $this->belongsTo(FrameConfig::class);
    }
}
