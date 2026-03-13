<?php

namespace App\Filament\Resources\FrameTemplates\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FrameTemplateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('frame_config_id')
                    ->numeric(),
                TextInput::make('category')
                    ->required()
                    ->default('Most Used'),
                TextInput::make('name'),
                TextInput::make('location'),
                DateTimePicker::make('createdAt')
                    ->required(),
                DateTimePicker::make('updatedAt')
                    ->required(),
            ]);
    }
}
