<!DOCTYPE html>
<html lang="en">
<head>
@php
use SimpleSoftwareIO\QrCode\Facades\QrCode;
@endphp
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Ticket #{{ $tiket->id }}</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin: 2rem; }
        .qr { margin: 1rem auto; }
        .info { margin: 1rem auto; font-size: 1.2rem; }
        .print-button { position: fixed; top: 1rem; right: 1rem; }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">Print</button>

    <h1>Ticket #{{ $tiket->id }}</h1>

    <div class="qr">
        {!! QrCode::size(200)->generate($tiket->ticket_code) !!}
    </div>

    <div class="info">
        <p><strong>Code:</strong> {{ $tiket->ticket_code }}</p>
        <p><strong>Client:</strong> {{ $tiket->client_name }}</p>
        <p><strong>Room:</strong> {{ $tiket->roomBox?->name }}</p>
        <p><strong>Session:</strong> {{ $tiket->session_time }} minutes</p>
        <p><strong>Payment:</strong> {{ $tiket->payment }}</p>
        <p><strong>Status:</strong> {{ ucfirst($tiket->status) }}</p>
    </div>
</body>
</html>