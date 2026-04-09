<?php

namespace App\Filament\Widgets;

use App\Models\Tiket;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TiketStatsOverview extends BaseWidget
{
    protected int|string|array $columnSpan = 'full';

    protected function getStats(): array
    {
        $totalTickets = Tiket::count();
        $paidTickets = Tiket::where('status_payment', 1)->count();
        $unpaidTickets = $totalTickets - $paidTickets;
        $activeTickets = Tiket::whereIn('status', ['waiting', 'running'])->count();

        return [
            Stat::make('Total Tickets', $totalTickets)
                ->description('All tickets created')
                ->descriptionIcon('heroicon-m-ticket')
                ->color('primary'),

            Stat::make('Paid Tickets', $paidTickets)
                ->description('Tickets marked as paid')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('success'),

            Stat::make('Unpaid Tickets', $unpaidTickets)
                ->description('Tickets not yet paid')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),

            Stat::make('Active Tickets', $activeTickets)
                ->description('Waiting or running tickets')
                ->descriptionIcon('heroicon-m-play-circle')
                ->color('warning'),
        ];
    }
}
