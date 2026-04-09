<?php

namespace App\Filament\Widgets;

use App\Models\Tiket;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Columns\IconColumn;
use Filament\Widgets\TableWidget as BaseWidget;
use Livewire\Attributes\Reactive;

class TicketsWidget extends BaseWidget
{
    protected int|string|array $columnSpan = 'full';

    #[Reactive]
    public string $sortBy = 'latest';

    public function table(Table $table): Table
    {
        return $table
            ->query(Tiket::query())
            ->modifyQueryUsing(function ($query, $livewire) {
                $sort = $livewire->tableFilters['sortBy']['value'] ?? 'latest';

                return $sort === 'oldest'
                    ? $query->oldest('createdAt')
                    : $query->latest('createdAt');
            })
            ->columns([
                TextColumn::make('ticket_code')
                    ->label('Code')
                    ->searchable()
                    ->copyable(),

                TextColumn::make('client_name')
                    ->label('Client')
                    ->searchable(),

                TextColumn::make('roomBox.name')
                    ->label('Room'),

                TextColumn::make('session_time')
                    ->label('Session (min)'),

                TextColumn::make('payment')
                    ->label('Payment'),

                IconColumn::make('status_payment')
                    ->label('Paid')
                    ->boolean(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'waiting' => 'gray',
                        'running' => 'warning',
                        'finish' => 'success',
                    }),

                TextColumn::make('createdAt')
                    ->label('Created')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('sortBy')
                    ->options([
                        'latest' => 'Latest',
                        'oldest' => 'Oldest',
                    ])
                    ->default('latest')
                    ->label('Sort by')
                    ->query(fn($query) => $query),
            ])
            ->heading('Tickets')
            ->description('Filter and view tickets by creation date');
    }
}
