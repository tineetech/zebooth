import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const api = import.meta.env.VITE_BE_URL;

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const [shots, setShots] = useState([]);
  const [shooting, setShooting] = useState(true);
  const [countdown, setCountdown] = useState(2);
  const getSessionTime = localStorage.getItem('session_time')
  const sessionTimeMs = getSessionTime * 60;
  const [sessionTimer, setSessionTimer] = useState(sessionTimeMs);
  const [locked, setLocked] = useState(false);
  const [flash, setFlash] = useState(false);

  const MAX_SHOTS = 10;
  
  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (!checkSetupEnv) {
    return window.location.href = '/setup'
  }

  const getTiketConfig = () => {
    const kode_tiket = localStorage.getItem('kode_tiket')
    fetch(api + '/api/tiket/get-detail/' + kode_tiket)
    .then(res => res.json())
    .then(data => {
      console.log(data.data)
    })
  }

  useEffect(() => {
    getTiketConfig()
  }, [])

  // ================= CAMERA =================
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      videoRef.current.srcObject = media;
      setStream(media);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
  };


  // ================= SESSION TIMER =================
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimer((p) => (p > 0 ? p - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const [timeoutShown, setTimeoutShown] = useState(false);
  useEffect(() => {
    const isTimeout = localStorage.getItem('foto_timeout') === 'true';

    if ((sessionTimer === 0 || isTimeout) && !timeoutShown) {
      setTimeoutShown(true);
      setShooting(false);
      setLocked(true);
      stopCamera();

      localStorage.setItem('foto_timeout', 'true');

      Swal.fire({
        icon: "warning",
        title: "Waktu Habis!",
        text: "Silakan minta waktu tambahan sebesar Rp2.000/1 menit ke admin.",
        confirmButtonText: "OK",
        confirmButtonColor: "#f6a57f",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  }, [sessionTimer, timeoutShown]);

  useEffect(() => {
    if (!locked) return;

    const kode_tiket = localStorage.getItem("kode_tiket");

    const interval = setInterval(async () => {
      try {
        const res = await fetch(api + "/api/tiket/check-additional-times/" + kode_tiket);

        const data = await res.json();

        if (data.success && data.data.additional_time > 0) {
          localStorage.setItem('foto_timeout', false)
          
          setTimeoutShown(false);
          setSessionTimer(data.data.additional_time * 60);
          setLocked(false);
          setShooting(true);
          startCamera();
          fetch(api + '/api/tiket/set-null-additional-times/' + kode_tiket)
          .then(res => res.json())
          .then(data => {

            if (data.success) {
              console.log('success set to null ', data)
            }
          })
        }
        console.log(data)
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [locked]);

  // ================= AUTO SHOOT =================
  useEffect(() => {
    if (!shooting) return;
    if (shots.length >= MAX_SHOTS) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          takePhoto();
          return 2;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [shooting, shots.length]);

  const shootingLock = useRef(false);

  const takePhoto = () => {
    if (shootingLock.current) return;
    shootingLock.current = true;

    setTimeout(() => {
      shootingLock.current = false;
    }, 500);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // ❗ cek apakah video sudah siap
    if (video.readyState < 2) {
      console.log("Video belum siap");
      return;
    }

    const ctx = canvas.getContext("2d");

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      console.log("Video size belum ada");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");

    setFlash(true);
    setTimeout(() => setFlash(false), 120);

    setShots((prev) => {
      const updated = [...prev, data];

      if (updated.length >= MAX_SHOTS) {
        setShooting(false);
      }

      return updated;
    });
  };
  // ================= RESET =================
  const resetShoot = async () => {
    setShots([]);
    setCountdown(2);
    setShooting(true);

    const video = videoRef.current;

    if (stream && video) {
      video.srcObject = null;

      setTimeout(() => {
        video.srcObject = stream;
        video.play();
      }, 200);
    } else {
      await startCamera();
    }
  };
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // ================= GRID =================
  const renderGrid = () => {
    const items = [];
    const totalBox = 9;


    for (let i = 0; i < totalBox; i++) {
      const img = shots[i];
      const isSelected = selectedPhotos.includes(img);

      items.push(
        <div
          key={i}
          onClick={() => {
            if (!img) return;

            setAutoPreview(false);

            setSelectedPhotos((prev) => {
              const already = prev.includes(img);

              if (already) {
                return prev.filter((p) => p !== img); // unselect
              }

              if (prev.length >= 4) return prev; // max 4

              return [...prev, img];
            });

            setSelectedIndex(i);
          }}
          className={`w-[200px] h-[120px] cursor-pointer rounded-lg overflow-hidden transition-all duration-200
          ${isSelected
              ? "opacity-60"
              : selectedIndex === i
                ? "preview-on-grid"
                : "bg-gray-200"
            }`}
          >
          {img ? (
            <img src={img} className="w-full h-full object-cover" />
          ) : (
            `Shot ${i + 1}`
          )}
        </div>
      );
    }

    return items;
  };
  const finished = shots.length >= MAX_SHOTS;

  // preview grid logic
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoPreview, setAutoPreview] = useState(true);
  useEffect(() => {
    if (shots.length > 0 && finished) {
      setSelectedIndex(0);
    }
  }, [finished]);
  useEffect(() => {
    if (!finished || !autoPreview) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % shots.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [finished, shots.length, autoPreview]);

  // select 4 photo logic
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handleNextToFilter = async () => {
    if (selectedPhotos.length !== 4) {
      alert("Pilih tepat 4 foto dulu!");
      return;
    }

    try {
      const selectedIndexes = selectedPhotos.map(p => shots.indexOf(p));
      const kode_tiket = localStorage.getItem('kode_tiket')

      const res = await fetch(api + "/api/photobooth/save-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shots,
          selectedIndexes,
          kode_tiket
        }),
      });

      const data = await res.json();
      console.log(data)
      localStorage.removeItem("sessionId");
      localStorage.setItem("sessionId", data.sessionId);

      navigate("/filter");
    } catch (err) {
      console.error(err);
      alert("Gagal kirim foto ke server");
    }
  };
  return (
    <div
      className={`w-full h-full grid gap-6 relative ${finished ? "md:grid-cols-1" : "md:grid-cols-1"
        }`}
    >
      {/* TIMER */}
      <div className="absolute right-4 top-1 text-lg font-bold text-gray-300">
        ⏱ {formatTime(sessionTimer)}
      </div>
      <div className="absolute left-9 top-1 text-lg font-bold text-gray-300">
        📸 {shots.length}
      </div>

      {locked && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">⛔ Waktu Habis</h1>

          <p className="text-lg mb-6 text-center max-w-md">
            Silakan minta tambahan waktu ke admin  
            sebesar <span className="font-bold text-yellow-400">Rp2.000/1 menit</span>
          </p>

          <div className="animate-pulse text-sm text-gray-300">
            Menunggu konfirmasi dari admin...
          </div>
        </div>
      )}

      {
        !finished && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white mb-6">
              Ambil Pose Terbaikmu 
            </h1>

            {
              finished ? (
                <div className="w-[650px] h-[400px] bg-black rounded-xl overflow-hidden shadow-lg relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* FLASH WHITE */}
                  {flash && (
                    <div className="absolute inset-0 bg-white animate-pulse opacity-80 pointer-events-none" />
                  )}

                  {/* COUNTDOWN */}
                  {shooting && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold bg-black/20">
                      {countdown}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-[1050px] h-[500px] bg-black rounded-xl overflow-hidden shadow-lg relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* FLASH WHITE */}
                  {flash && (
                    <div className="absolute inset-0 bg-white animate-pulse opacity-80 pointer-events-none" />
                  )}

                  {/* COUNTDOWN */}
                  {shooting && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold bg-black/20">
                      {countdown}
                    </div>
                  )}
                </div>
              )
            }

            <p className="text-sm text-gray-300 mt-3 text-center max-w-sm">
              Foto otomatis tiap 5 detik sebanyak 10x.
            </p>
          </div>
        )
      }

      {/* GRID HASIL (muncul setelah selesai) */}
      {finished && (
        <div className="flex flex-col h-[93%]">


          <div className="w-full flex flex-col items-center h-full justify-center">
            <h2 className="text-4xl font-bold text-white mb-15">
              Pilih 4 Gambar Terbaik Mu.
            </h2>
            <div className="w-full flex gap-3 items-center justify-center">
              <div className="w-[940px] h-[380px] flex justify-center">
                <img
                  key={selectedIndex}
                  src={shots[selectedIndex]}
                  className="rounded-xl preview-grid w-full h-full animate-fade"
                />
              </div>
              <div className="w-full flex justify-center ">
                <div className="w-[600px] h-[380px] grid grid-cols-3 gap-3 p-0 justify-center items-center ">
                  {renderGrid()}
                </div>

              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={resetShoot}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              🔁 Ulang
            </button>

            <button
              onClick={handleNextToFilter}
              disabled={selectedPhotos.length !== 4}
              className={`px-6 py-2 rounded-lg text-white font-semibold shadow 
                ${selectedPhotos.length === 4 
                  ? "bg-[#f6a57f] hover:opacity-90" 
                  : "bg-gray-300 cursor-not-allowed"}
              `}
            >
              Next ➜
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}