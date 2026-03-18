import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_BE_URL;

const Verify = () => {
  const scannerRef = useRef(null);
  const startedRef = useRef(false);
  const scanLockRef = useRef(false); // 🔥 lock scan
  const navigate = useNavigate();
  
  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (!checkSetupEnv) {
    return window.location.href = '/setup'
  }

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 350 },
          async (decodedText) => {
            if (scanLockRef.current) return;

            scanLockRef.current = true; // 🔒 lock scan

            try {
              const res = await fetch(api + "/api/tiket/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  tiket: decodedText,
                  roomBoxId: localStorage.getItem('id-roombox')
                }),
              });

              const data = await res.json();

              if (data.success) {
                // if (scannerRef.current && startedRef.current) {
                //   await scannerRef.current.stop();
                //   await scannerRef.current.clear();
                // }

                localStorage.setItem('kode_tiket', data.data.kode_tiket);
                localStorage.setItem('frame_id', data.data.frame_config_id);
                localStorage.setItem('session_time', data.data.data.session_time);

                Swal.fire({
                  title: "Success!",
                  text: "Berhasil verifikasi QR, lanjut pilih template",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                }).then(() => {
                  navigate("/template");
                });
              } else {
                Swal.fire({
                  title: "Gagal!",
                  text: "QR tidak valid / belum bayar",
                  icon: "error",
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
            } catch (err) {
              console.error(err);
            }

            // ⏳ buka lock setelah delay
            setTimeout(() => {
              scanLockRef.current = false;
            }, 2000); // delay 2 detik
          },
          () => {}
        );

        startedRef.current = true;
      } catch (err) {
        console.error("Scanner start error:", err);
      }
    };

    startScanner();

    return () => {
      const stopScanner = async () => {
        try {
          if (scannerRef.current && startedRef.current) {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
          }
        } catch {}
      };

      stopScanner();
    };
  }, [navigate]);

  return (
    <div className="w-full h-full grid md:grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Silakan Scan Barcode
        </h1>

        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <div id="reader" className="w-full h-full" />
        </div>

        <p className="text-sm text-gray-400 mt-3 text-center max-w-sm">
          Arahkan barcode atau QR tiket ke kamera
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full">
        <div className="p-6 h-full w-full flex flex-col justify-center border-l border-gray-400">
          <h2 className="text-xl font-bold mb-4 text-white">
            Panduan Scan
          </h2>

          <ul className="space-y-3 text-gray-400">
            <li className="flex gap-2">📱 Siapkan tiket barcode atau QR</li>
            <li className="flex gap-2">📷 Posisikan di tengah kamera</li>
            <li className="flex gap-2">⚡ Pastikan pencahayaan cukup</li>
            <li className="flex gap-2">🚀 Scan berhasil → mulai photobooth</li>
          </ul>

          {/* Tips box */}
          <div className="mt-5 p-4 rounded-lg bg-purple-50 border border-purple-100 text-sm text-purple-700">
            💡 Tips: Tingkatkan kecerahan layar jika scan dari HP
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
