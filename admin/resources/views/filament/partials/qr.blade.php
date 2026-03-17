@php
    use SimpleSoftwareIO\QrCode\Facades\QrCode;

    $qrValue = $text ?? (isset($getRecord) ? $getRecord()->ticket_code : null);
@endphp

<div class="flex flex-col items-center p-2 bg-white border rounded" style="padding-block: 10px">
    @if($qrValue)
        {!! QrCode::size(120)->generate($qrValue) !!}
        {{-- <p class="text-xs mt-2 font-mono text-gray-600">{{ $qrValue }}</p> --}}
    @else
        <span class="text-gray-500 italic text-sm">(No QR Code)</span>
    @endif
</div>