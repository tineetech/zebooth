<?php

namespace App\Filament\Resources\FrameTemplates\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;

class FrameTemplateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('location')
                    ->visibility('public')
                    ->disk('public')
                    ->directory('frames') // Folder penyimpanan di storage
                    ->image()
                    ->label('Gambar Frame'),
                Select::make('frame_config_id')
                    ->relationship('frameConfig', 'name'),
                Select::make('category')
                    ->required()
                    ->options([
                        'Most Used' => 'Most Used',
                        'Classic' => 'Classic',
                        'Vintage' => 'Vintage',
                        'Trendy' => 'Trendy',
                        'Cute & Fun' => 'Cute & Fun',
                    ])
                    ->default('Most Used'),
                TextInput::make('name'),
                // TextInput::make('location'),
            ]);
    }
}
