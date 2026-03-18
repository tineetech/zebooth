import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const api = import.meta.env.VITE_BE_URL;

const categories = ["Most Used", "Classic", "Vintage", "Trendy", "Cute & Fun"];


function SelectTemplate() {
  const [activeCategory, setActiveCategory] = useState("Most Used");
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState({});

  const navigate = useNavigate();
  const getFrameId = localStorage.getItem('frame_id')
  const getSessionTime = localStorage.getItem('session_time')
  
  const formattedHour = String(getSessionTime).padStart(2, '0'); 
  const formattedTime = getSessionTime ? `${formattedHour}:00` : '00:00'; 
  
  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (!checkSetupEnv) {
    return window.location.href = '/setup'
  }

  const getFrameTemplate = () => {
    fetch(api + '/api/frame/get-template')
    .then(res => res.json())
    .then(data => {
      const filtered = data.data.filter(
        (t) => t.category === activeCategory && t.frame_config_id == getFrameId
      );
      setTemplates(filtered)
      setSelectedTemplate(filtered[0])
      console.log(filtered)
    })
  }
  
  const saveTemplate = () => {
    const kode_tiket = localStorage.getItem('kode_tiket')
    fetch(api + '/api/frame/save-template', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frame_id: selectedTemplate.id,
          kode_tiket,
        }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        navigate('/panduan')
      }
    })
  }


  useEffect(() => {
    getFrameTemplate()
  }, [])
  return (
    <div className="w-full flex flex-col relative mt-0 !h-[300px] p-6">

      {/* ⏱ Timer */}
      <div className="absolute top-6 right-6 text-xl font-semibold text-gray-300">
        ⏱ {formattedTime ?? '00:00'}
      </div>

      {/* 🏷 Title */}
      <h1 className="text-center text-3xl font-bold text-primary mb-6">
        Pilih Template Bingkai Mu.
      </h1>

      {/* 📦 Main Layout */}
      <div className="flex flex-1 gap-6 mb-5 ">

        {/* LEFT PANEL */}
        <div className="w-1/2 bg-white h-[500px] rounded-2xl shadow-lg p-4 flex gap-4">

          {/* Categories */}
          <div className="w-36 border-r pr-3 gap-2 flex flex-col">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`block w-full text-center px-2 py-2 rounded-lg mb-2 !text-[10px] font-medium transition ${
                  activeCategory === cat
                    ? "bg-[#f6c7b6] text-[#355872]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="flex-1 grid grid-cols-2 gap-3 p-1 overflow-y-auto pr-1">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`cursor-pointer h-[200px] py-2 rounded-md transition-all ease-in-out  ${
                  selectedTemplate.id === tpl.id
                    ? ""
                    : "border-transparent"
                }`}
                style={{boxShadow: selectedTemplate.id === tpl.id ? "0 0 5px rgba(0,0,0,.2)" : ""}}
              >
                
                <div className="flex w-full h-full">
                  <img
                    src={tpl.location}
                    alt={tpl.name}
                    className="w-full h-full object-contain object-right"
                  />
                  <img
                    src={tpl.location}
                    alt={tpl.name}
                    className="w-full h-full object-contain object-left"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (PREVIEW) */}
        <div className="w-1/2  h-[430px] rounded-2xl shadow-lg p-6 flex items-center justify-center">
          <div className="w-full max-w-sm rounded-xl overflow-hidden h-full">            
            <div className="flex w-full h-full">
              <img
                src={selectedTemplate.location}
                alt="Preview"
                className="w-full h-full object-contain object-right"
              />
              <img
                src={selectedTemplate.location}
                alt="Preview"
                className="w-full h-full object-contain object-left"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ⬅ BACK */}
      {/* <button className="absolute bottom-6 left-6 bg-white border border-[#355872] text-[#355872] px-5 py-2 rounded-xl font-semibold shadow hover:bg-gray-50">
        ← BACK
      </button> */}

      {/* NEXT ➡ */}
      <div className="flex justify-end -mt-15 ">
        <button className=" bg-[#f6a57f] text-white px-6 py-1 rounded-xl font-semibold shadow hover:scale-105 transition" onClick={() => saveTemplate()}>
          NEXT →
        </button>

      </div>
    </div>
  );
}

export default SelectTemplate;
