<?php

namespace App\Filament\Resources\Tikets\Schemas;

use Illuminate\Support\HtmlString;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Schema;

class TiketForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Frame
                Select::make('frame_config_id')
                    ->label('Frame config')
                    ->relationship('frameConfig', 'name')
                    ->searchable()
                    ->preload()
                    ->rules(['nullable','integer','exists:frame_config,id']),

                // Room Box
                Select::make('room_box_id')
                    ->label('Room box')
                    ->relationship('roomBox', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->rules(['required','integer','exists:room_box,id']),

                // Ticket Code
                TextInput::make('ticket_code')
                    ->label('Ticket code')
                    ->helperText('Generated automatically on save')
                    ->maxLength(32)
                    ->rules(['nullable','string','max:32','unique:tiket,ticket_code,{{record}}']),

                TextInput::make('client_name')
                    ->required()
                    ->maxLength(255)
                    ->rules(['required','string','max:255']),

                TextInput::make('session_time')
                    ->numeric()
                    ->label('Session (minutes)')
                    ->required()
                    ->rules(['required','integer','min:1']),

                TextInput::make('payment')
                    ->required()
                    ->maxLength(255)
                    ->rules(['required','in:cash,qris']),

                Toggle::make('status_payment')
                    ->label('Paid?')
                    ->rules(['boolean']),

                Select::make('status')
                    ->options([
                        'waiting' => 'Waiting',
                        'running' => 'Running',
                        'finish' => 'Finished',
                    ])
                    ->required()
                    ->rules(['required','in:waiting,running,finish']),

                // Frame Template
                Select::make('frame_template_id')
                    ->label('Frame template')
                    ->relationship('frameTemplate', 'name')
                    ->searchable()
                    ->preload()
                    ->rules(['nullable','integer','exists:frame_template,id']),

                // QR Code Preview
                Placeholder::make('qr_preview')
                    ->label('QR code')
                    ->content(function (?\App\Models\Tiket $record) {
                        $value = $record?->ticket_code;

                        if (! $value) {
                            return new HtmlString('<em>Save to generate QR Code</em>');
                        }

                        try {
                            return view('filament.partials.qr', ['text' => $value]);
                        } catch (\Throwable $e) {
                            return new HtmlString(e($value));
                        }
                    }),
        ]);
    }
}
