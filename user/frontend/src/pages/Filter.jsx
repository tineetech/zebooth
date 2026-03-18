import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";

const api = import.meta.env.VITE_BE_URL;

const FILTER_STYLES = {
  none: "",
  natural: "brightness(1.05) contrast(1.05) saturate(1.05)",
  cool: "brightness(0.95) contrast(1.1) hue-rotate(40deg) saturate(1.2)",
  film: "contrast(1.2) saturate(0.9) sepia(0.15)",
  cinematic: "contrast(1.3) brightness(0.9) saturate(0.8)",
  vintage: "sepia(0.4) contrast(0.9) brightness(1.05)",
  bw: "grayscale(100%) contrast(1.1)",
  blink: "brightness(1.2) contrast(1.3) saturate(1.4)",
};

const CardFilter = ({ gambar, nama_filter, isActive, onClick }) => {
  const filterStyle = FILTER_STYLES[nama_filter] || "";

  return (
    <div
      onClick={onClick}
      className={`w-[190px] h-[150px] p-1.5 bg-white rounded-md overflow-hidden border-2 cursor-pointer transition-all
        ${isActive ? 'border-primary shadow-lg' : 'border-transparent'}`}
    >
      <img
        src={gambar}
        className="w-full h-[80%] object-cover object-top "
        alt={nama_filter}
        style={{ filter: filterStyle }}
      />

      <div className="mt-2 text-center">
        <span className="text-gray-700 font-medium capitalize">
          {nama_filter === "bw" ? "B&W" : nama_filter}
        </span>
      </div>
    </div>
  );
};

export default function Filter() {
  const navigate = useNavigate();
  
  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (!checkSetupEnv) {
    return window.location.href = '/setup'
  }

  const filters = [
    { id: 1, name: "none" },
    { id: 2, name: "natural" },
    { id: 3, name: "cool" },
    { id: 4, name: "film" },
    { id: 5, name: "cinematic" },
    { id: 6, name: "vintage" },
    { id: 7, name: "bw" },
    { id: 8, name: "blink" },
  ];
  const [preview, setPreview] = useState(null);
  const [previewMerged, setPreviewMerged] = useState(null);
  const [previewFilterGrid, setPreviewFilterGrid] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("none");

  const sessionId = localStorage.getItem("sessionId");

  // ================= LOAD PREVIEW AWAL =================
  useEffect(() => {
    loadPreview();
  }, []);

  const loadPreview = async () => {
    const res = await fetch(api + "/api/photobooth/session/" + sessionId);
    const data = await res.json();
    console.log(data)
    setPreview(api + data.finalUrl);
    setPreviewMerged(api + data.mergedUrl);
    setPreviewFilterGrid(api + data.previewUrl);
  };

  // ================= APPLY FILTER =================
  const applyFilter = async (filterName) => {
    const node = document.getElementById("preview-grid");

    const dataUrl = await htmlToImage.toPng(node, {
      pixelRatio: 2, // supaya hasil tajam
    });
    const res = await fetch(api + "/api/photobooth/apply-filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        filter: filterName,
        image: dataUrl
      }),
    });

    const data = await res.json();

    if (data.success) {
      // console.log(data.url)
      localStorage.setItem('finalUrl', api + data.url)
      localStorage.setItem('qrUrl', api + data.qrUrl)
      navigate('/waiting')
    }

    // setPreview(data.finalUrl);
    // setPreviewMerged(data.mergedUrl);
  };
  return (
    <div className="flex w-full justify-between">
      {/* LEFT PREVIEW */}
      <div className="w-[600px] h-[580px] mr-4 flex justify-center items-center">
        {preview && previewMerged ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex items-center justify-center w-[95%] p-10">

              <div className="relative  flex justify-center w-full h-full bg-red-400" id="preview-grid">
                  <img
                    src={previewMerged}
                    className="object-cover absolute left-0 top-[0px] object-right w-full h-full  p-0"
                    style={{filter: FILTER_STYLES[selectedFilter]}}
                    />
                  <img
                    src={preview}
                    className="object-cover object-right w-full h-full  p-0"
                    />
              </div>
              <div className="relative  flex w-full h-full">
                <img
                  src={previewMerged}
                  className="object-contain absolute left-0 top-[0px] object-left w-full h-full  p-0"
                  style={{filter: FILTER_STYLES[selectedFilter]}}
                  />
                <img
                  src={preview}
                  className="object-contain object-left w- w-[320px] h-full  p-0"
                  />
              </div>
            </div>
          </div>
        ) : (
          <p>Loading preview...</p>
        )}
      </div>

      {/* RIGHT FILTER PANEL */}
      <div className="flex flex-col ml-2 justify-start w-[70%]">
        <div>
          <h1 className="font-bold text-2xl text-primary">Tambahkan Filter</h1>
          <p className="text-gray-300 mb-5">Pilih filter favoritmu untuk mempercantik foto.</p>
          
          <div className="grid grid-cols-3 gap-4 overflow-y-auto w-full overflow-x-hidden pr-4 h-[420px]">
            {filters.map((filter) => (
              <CardFilter 
                key={filter.id}
                gambar={previewFilterGrid}
                nama_filter={filter.name}
                isActive={selectedFilter === filter.name}
                onClick={() => setSelectedFilter(filter.name)}
              />
            ))}
          </div>

          <button onClick={() => applyFilter(selectedFilter)} className="block w-full text-center px-4 py-3 rounded-lg mt-6 bg-primary text-white font-semibold hover:bg-opacity-90 transition">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}