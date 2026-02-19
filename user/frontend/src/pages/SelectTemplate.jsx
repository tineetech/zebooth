import React, { useState } from "react";

const categories = ["Most Used", "Classic", "Vintage", "Trendy", "Cute & Fun"];

const templates = [
  {
    id: 1,
    category: "Most Used",
    name: "Floral Peach",
    image: "/templates/temp1.png",
  },
  {
    id: 2,
    category: "Most Used",
    name: "Cute Sky",
    image: "/templates/temp2.png",
  },
  {
    id: 3,
    category: "Most Used",
    name: "Green Garden",
    image: "/templates/temp3.png",
  },
  {
    id: 4,
    category: "Classic",
    name: "Minimal Strip",
    image: "/templates/temp4.png",
  },
];

function SelectTemplate() {
  const [activeCategory, setActiveCategory] = useState("Most Used");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const filtered = templates.filter(
    (t) => t.category === activeCategory
  );

  return (
    <div className="w-full flex flex-col relative mt-0 h-full p-6">

      {/* ⏱ Timer */}
      <div className="absolute top-6 right-6 text-xl font-semibold text-gray-700">
        ⏱ 05:00
      </div>

      {/* 🏷 Title */}
      <h1 className="text-center text-3xl font-bold text-primary mb-6">
        Pilih Template Bingkai Mu.
      </h1>

      {/* 📦 Main Layout */}
      <div className="flex flex-1 gap-6 mb-10">

        {/* LEFT PANEL */}
        <div className="w-1/2 bg-white rounded-2xl shadow-lg p-4 flex gap-4">

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
          <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto pr-1">
            {filtered.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition hover:scale-105 ${
                  selectedTemplate.id === tpl.id
                    ? "border-[#355872]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={tpl.image}
                  alt={tpl.name}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (PREVIEW) */}
        <div className="w-1/2 bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
          <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg border">
            <img
              src={selectedTemplate.image}
              alt="Preview"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ⬅ BACK */}
      {/* <button className="absolute bottom-6 left-6 bg-white border border-[#355872] text-[#355872] px-5 py-2 rounded-xl font-semibold shadow hover:bg-gray-50">
        ← BACK
      </button> */}

      {/* NEXT ➡ */}
      <div className="flex justify-end">
        <button className=" bg-[#f6a57f] text-white px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition">
          NEXT →
        </button>

      </div>
    </div>
  );
}

export default SelectTemplate;
