<?php

namespace App\Filament\Resources\Tikets\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
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
                ViewColumn::make('qr_preview')
                    ->label('QR')
                    ->view('filament.partials.qr')
                    ->viewData(fn ($record) => ['text' => $record->ticket_code])
                    ->action(
                        Action::make('showQr')
                            ->modalHeading('QR Ticket')
                            ->modalSubmitAction(false)
                            ->modalCancelActionLabel('Tutup')
                            ->modalContent(fn ($record) => view(
                                'filament.partials.qr-modal',
                                ['text' => $record->ticket_code]
                            ))
                    ),
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
                TextColumn::make('additional_time')
                    ->numeric()
                    ->sortable()
                    ->default(0)
                    ->label('Additional Time (min)'),
                TextColumn::make('payment')
                    ->searchable(),
                IconColumn::make('status_payment')
                    ->boolean()
                    ->label('Paid'),
                IconColumn::make('status_print')
                    ->boolean()
                    ->label('Status Print'),
                IconColumn::make('status_reset')
                    ->boolean()
                    ->label('Status Reset'),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('createdAt')
                    ->dateTime()
                    ->sortable(),
                // QR Code preview
                // ViewColumn::make('qr_preview')
                //     ->label('QR')
                //     ->view('filament.partials.qr')
                //     ->viewData(fn($record) => ['text' => $record->ticket_code]),
            ])
            ->filters([
                // filters
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),

                // Action::make('print')
                //     ->icon('heroicon-o-printer')
                //     ->url(fn ($record) => route('ticket.print', $record))
                //     ->openUrlInNewTab(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
