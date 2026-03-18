import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const api = import.meta.env.VITE_BE_URL;

const Setup = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (checkSetupEnv) {
    return window.location.href = '/'
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomCode.trim()) {
      alert("Kode roombox wajib diisi");
      return;
    }

    try {
      
      const res = await fetch(api + "/api/roombox/login-roombox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code_room: roomCode,
          ip_devices: "192.168.1.10",
        }),
      });

      const data = await res.json();
      console.log("Room Code:", roomCode);

      if (data.success) {
          localStorage.setItem("setup-roombox", roomCode)
          localStorage.setItem("id-roombox", data.data.id)
          Swal.fire({
            title: "Success!",
            text: "Berhasil login roombox dan melakukan setup room.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          }).then(() => {
            navigate("/");
          });
      } else {
        Swal.fire({
          title: "Failed!",
          text: "Gagal login, kode room salah atau room sedang digunakan.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          navigate("/setup");
        });
      }
    } catch (err) {
      console.log(err)
      Swal.fire({
        title: "Failed!",
        text: "Gagal login, kode room salah atau room tidak active.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(() => {
        navigate("/setup");
      });
    }

  };

  return (
    <div className="w-full flex items-center justify-center h-full">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px] text-center">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Setup Roombox
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input
            type="text"
            placeholder="Masukkan Kode Roombox"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none text-center"
          />

          <button
            type="submit"
            className=" text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Lanjutkan
          </button>

        </form>
      </div>
    </div>
  );
};

export default Setup;