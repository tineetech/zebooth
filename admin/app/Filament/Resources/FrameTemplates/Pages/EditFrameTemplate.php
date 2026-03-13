<?php

namespace App\Filament\Resources\FrameTemplates\Pages;

use App\Filament\Resources\FrameTemplates\FrameTemplateResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFrameTemplate extends EditRecord
{
    protected static string $resource = FrameTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
