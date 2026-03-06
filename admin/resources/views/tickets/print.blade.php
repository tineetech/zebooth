<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Zebooth Ticket #{{ $tiket->id }}</title>
    <style>
        /* Mengatur ukuran kertas struk (biasanya lebar 80mm) */
        @page {
            margin: 0;
        }
        body {
            font-family: 'Courier', 'Monaco', monospace; /* Font struk khas */
            width: 70mm; /* Standar lebar kertas thermal */
            margin: 0 auto;
            padding: 10px;
            color: #000;
            line-height: 1.4;
        }

        .receipt-header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
        }

        .receipt-header h1 {
            font-size: 18px;
            margin: 5px 0;
            text-transform: uppercase;
        }

        .qr-container {
            text-align: center;
            margin: 15px 0;
            padding: 10px;
            background: #fff;
        }

        .qr-container img {
            /* QR Code dipastikan memiliki kontras tinggi */
            display: block;
            margin: 0 auto;
        }

        .info-table {
            width: 100%;
            font-size: 12px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        .info-table td {
            vertical-align: top;
            padding: 2px 0;
        }

        .label {
            width: 40%;
            text-transform: uppercase;
        }

        .value {
            width: 60%;
            font-weight: bold;
            text-align: right;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 10px;
        }

        .ticket-code-text {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 5px;
            display: block;
        }
    </style>
</head>
<body>
    <div class="receipt-header">
        <h1>ZEBOOTH</h1>
        <p>PHOTOBOOTH EXPERIENCE</p>
        <p>{{ date('d/m/Y H:i') }}</p>
    </div>

    <div class="qr-container">
        @php
            // Gunakan SVG format tapi pastikan rendering-nya solid
            // Kami gunakan margin(0) agar tidak ada padding putih berlebih di dalam gambar
            $svg = QrCode::format('svg')
                         ->size(180)
                         ->margin(0)
                         ->errorCorrection('H') // High error correction agar mudah discan walau agak lecek
                         ->generate($tiket->ticket_code);
            $base64Svg = base64_encode($svg);
        @endphp
        <img src="data:image/svg+xml;base64,{{ $base64Svg }}" width="180" height="180">
        <span class="ticket-code-text">{{ $tiket->ticket_code }}</span>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Client:</td>
            <td class="value">{{ $tiket->client_name }}</td>
        </tr>
        <tr>
            <td class="label">Room:</td>
            <td class="value">{{ $tiket->roomBox?->name ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Duration:</td>
            <td class="value">{{ $tiket->session_time }} Min</td>
        </tr>
        <tr>
            <td class="label">Payment:</td>
            <td class="value">{{ strtoupper($tiket->payment) }}</td>
        </tr>
    </table>

    <div class="footer">
        <p>PLEASE SCAN AT THE BOOTH</p>
        <p>*** Thank You ***</p>
    </div>
</body>
</html>