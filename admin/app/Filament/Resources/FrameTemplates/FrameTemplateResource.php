<?php

namespace App\Filament\Resources\FrameTemplates;

use App\Filament\Resources\FrameTemplates\Pages\CreateFrameTemplate;
use App\Filament\Resources\FrameTemplates\Pages\EditFrameTemplate;
use App\Filament\Resources\FrameTemplates\Pages\ListFrameTemplates;
use App\Filament\Resources\FrameTemplates\Schemas\FrameTemplateForm;
use App\Filament\Resources\FrameTemplates\Tables\FrameTemplatesTable;
use App\Models\FrameTemplate;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FrameTemplateResource extends Resource
{
    protected static ?string $model = FrameTemplate::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Frame Template';

    public static function form(Schema $schema): Schema
    {
        return FrameTemplateForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FrameTemplatesTable::configure($table);
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
            'index' => ListFrameTemplates::route('/'),
            'create' => CreateFrameTemplate::route('/create'),
            'edit' => EditFrameTemplate::route('/{record}/edit'),
        ];
    }
}
