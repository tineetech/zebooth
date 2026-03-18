<?php

namespace App\Filament\Resources\FrameTemplates\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Schemas\Components\Image;
use Filament\Tables\Table;

class FrameTemplatesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // TextColumn::make('frame_config_id')
                //     ->numeric()
                //     ->sortable(),
                ImageColumn::make('frameConfig.location')
                    ->label('Frame')
                    ->visibility('public')
                    ->disk('public')
                    ->width(300)
                    ->height(100)
                    ->getStateUsing(fn ($record) => $record->location),
                TextColumn::make('frameConfig.name')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('category')
                    ->searchable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('location')
                    ->searchable(),
                TextColumn::make('createdAt')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('updatedAt')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
