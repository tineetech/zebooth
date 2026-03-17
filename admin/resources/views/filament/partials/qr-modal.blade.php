<div style="display:flex; justify-content:center; padding:20px;">
    <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data={{ $text }}" 
        style="width:300px; height:300px;"
    />
</div>

<div style="text-align:center; font-weight:bold;">
    {{ $text }}
</div>