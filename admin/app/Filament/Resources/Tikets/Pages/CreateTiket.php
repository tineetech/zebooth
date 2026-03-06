<?php

namespace App\Filament\Resources\Tikets\Pages;

use App\Filament\Resources\Tikets\TiketResource;
use Filament\Resources\Pages\CreateRecord;

class CreateTiket extends CreateRecord
{
    protected static string $resource = TiketResource::class;

    protected function getRedirectUrl(): string
    {
        return route('ticket.print', ['tiket' => $this->record->id]);
    }
}
