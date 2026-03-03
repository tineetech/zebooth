<?php

namespace App\Filament\Resources\FrameConfigs;

use App\Filament\Resources\FrameConfigs\Pages\CreateFrameConfig;
use App\Filament\Resources\FrameConfigs\Pages\EditFrameConfig;
use App\Filament\Resources\FrameConfigs\Pages\ListFrameConfigs;
use App\Filament\Resources\FrameConfigs\Schemas\FrameConfigForm;
use App\Filament\Resources\FrameConfigs\Tables\FrameConfigsTable;
use App\Models\FrameConfig;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FrameConfigResource extends Resource
{
    protected static ?string $model = FrameConfig::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Frame Config';

    public static function form(Schema $schema): Schema
    {
        return FrameConfigForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FrameConfigsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFrameConfigs::route('/'),
            'create' => CreateFrameConfig::route('/create'),
            'edit' => EditFrameConfig::route('/{record}/edit'),
        ];
    }
}
