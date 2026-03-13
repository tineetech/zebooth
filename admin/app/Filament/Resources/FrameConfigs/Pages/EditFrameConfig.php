<?php

namespace App\Filament\Resources\FrameConfigs\Pages;

use App\Filament\Resources\FrameConfigs\FrameConfigResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFrameConfig extends EditRecord
{
    protected static string $resource = FrameConfigResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
