import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "/guide/1.jpg",
  "/guide/2.jpg",
  "/guide/3.jpg",
  "/guide/4.jpg",
];

const Panduan = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  // 🔄 Auto Carousel (3 detik)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ⏳ Countdown 15 detik
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/camera"); // ganti ke halaman kamera kamu
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="w-full h-full flex flex-col">

      {/* 🎞 Carousel */}
      {/* ⏳ Countdown Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Sesi foto akan dimulai dalam
        </h2>

        <div className="text-6xl font-bold text-primary mb-4">
          {countdown}
        </div>

        <p className="text-gray-400 max-w-md">
          Pastikan posisi sudah siap, rapikan rambut, dan tersenyum 😊
          Kamera akan otomatis mengambil foto saat waktu habis.
        </p>
      </div>
    </div>
  );
};

export default Panduan;