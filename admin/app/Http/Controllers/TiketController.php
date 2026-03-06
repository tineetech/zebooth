<?php

namespace App\Http\Controllers;

use App\Models\Tiket;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class TiketController extends Controller
{
    /**
     * endpoint used by the client app when it scans a QR code.
     * the payload should contain `code` (the ticket_code) and
     * optionally `room` or other context.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $tiket = Tiket::where('ticket_code', $request->code)->first();

        if (! $tiket) {
            return response()->json([
                'valid' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        // Ticket check
        $valid = $tiket->status_payment && in_array($tiket->status, ['waiting', 'running']);

        return response()->json([
            'valid' => $valid,
            'tiket' => $tiket,
        ]);
    }

    /**
     * Render a printable ticket view containing the QR code and basic info.
     * Opened from the admin panel using a dedicated link or action.
     */
    public function print(Tiket $tiket)
    {
        $pdf = Pdf::loadView('tickets.print', compact('tiket'))
            ->setPaper([0, 0, 300, 420], 'portrait'); // Custom size (width x height)

        return $pdf->stream('Ticket-' . $tiket->ticket_code . '.pdf');
    }
}
