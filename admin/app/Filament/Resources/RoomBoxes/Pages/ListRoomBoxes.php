<?php

namespace App\Filament\Resources\RoomBoxes\Pages;

use App\Filament\Resources\RoomBoxes\RoomBoxResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRoomBoxes extends ListRecords
{
    protected static string $resource = RoomBoxResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
