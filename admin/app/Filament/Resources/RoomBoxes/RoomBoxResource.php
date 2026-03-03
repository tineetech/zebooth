<?php

namespace App\Filament\Resources\RoomBoxes;

use App\Filament\Resources\RoomBoxes\Pages\CreateRoomBox;
use App\Filament\Resources\RoomBoxes\Pages\EditRoomBox;
use App\Filament\Resources\RoomBoxes\Pages\ListRoomBoxes;
use App\Filament\Resources\RoomBoxes\Schemas\RoomBoxForm;
use App\Filament\Resources\RoomBoxes\Tables\RoomBoxesTable;
use App\Models\RoomBox;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RoomBoxResource extends Resource
{
    protected static ?string $model = RoomBox::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Room Box';

    public static function form(Schema $schema): Schema
    {
        return RoomBoxForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RoomBoxesTable::configure($table);
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
            'index' => ListRoomBoxes::route('/'),
            'create' => CreateRoomBox::route('/create'),
            'edit' => EditRoomBox::route('/{record}/edit'),
        ];
    }
}
