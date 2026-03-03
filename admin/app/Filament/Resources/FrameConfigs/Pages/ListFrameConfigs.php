<?php

namespace App\Filament\Resources\FrameConfigs\Pages;

use App\Filament\Resources\FrameConfigs\FrameConfigResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFrameConfigs extends ListRecords
{
    protected static string $resource = FrameConfigResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
