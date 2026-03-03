<?php

namespace App\Filament\Resources\Tikets\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ViewColumn;
use Filament\Tables\Table;

class TiketsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('roomBox.name')
                    ->label('Room')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('ticket_code')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('client_name')
                    ->searchable(),
                TextColumn::make('session_time')
                    ->numeric()
                    ->sortable()
                    ->label('Session (min)'),
                TextColumn::make('payment')
                    ->searchable(),
                IconColumn::make('status_payment')
                    ->boolean()
                    ->label('Paid'),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('createdAt')
                    ->dateTime()
                    ->sortable(),
                // QR Code preview
                ViewColumn::make('qr_preview')
                    ->label('QR')
                    ->view('filament.partials.qr')
                    ->viewData(fn($record) => ['text' => $record->ticket_code]),
            ])
            ->filters([
                // filters
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('print')
                    ->icon('heroicon-o-printer')
                    ->url(fn ($record) => route('ticket.print', $record))
                    ->openUrlInNewTab(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
