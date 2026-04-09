<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\TicketsWidget;
use App\Filament\Widgets\RoomTicketStatsWidget;
use App\Filament\Widgets\TiketStatsOverview;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return [
            TiketStatsOverview::class,
            RoomTicketStatsWidget::class,
            TicketsWidget::class,
        ];
    }

    public function getColumns(): int | array
    {
        return 2;
    }
}
