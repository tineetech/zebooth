<?php

namespace App\Filament\Widgets;

use App\Models\RoomBox;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class RoomTicketStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $rooms = RoomBox::withCount('tickets')->get();

        $stats = [];

        foreach ($rooms as $room) {
            $stats[] = Stat::make($room->name, $room->tickets_count)
                ->description('Tickets in this room')
                ->descriptionIcon('heroicon-m-home')
                ->color('info');
        }

        return $stats;
    }
}
