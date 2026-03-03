<?php

namespace App\Filament\Resources\RoomBoxes\Pages;

use App\Filament\Resources\RoomBoxes\RoomBoxResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRoomBox extends EditRecord
{
    protected static string $resource = RoomBoxResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
