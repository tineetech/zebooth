<?php

namespace App\Filament\Resources\FrameTemplates\Pages;

use App\Filament\Resources\FrameTemplates\FrameTemplateResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFrameTemplates extends ListRecords
{
    protected static string $resource = FrameTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
