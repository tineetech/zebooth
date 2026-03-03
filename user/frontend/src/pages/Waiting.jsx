import React, { useEffect, useState } from "react";

const api = import.meta.env.VITE_BE_URL;

const Waiting = () => {
  const sessionId = localStorage.getItem('sessionId')
  const [allPhotos, setAllPhotos] = useState([])
  const [activeIndex, setActiveIndex] = useState(0);
  const allPhotoCount = 10;

  const getAllPhotos = () => {

    const urls = Array.from({ length: allPhotoCount }, (_, i) => {
      return `${api}/uploads/sessions/${sessionId}/shot_${i}.png`;
    });

    setAllPhotos(urls);
  }
  useEffect(() => {
    getAllPhotos()
  }, [])

  useEffect(() => {
    if (!allPhotos.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allPhotos.length);
    }, 2000); // ganti tiap 2 detik (ubah sesuai selera)

    return () => clearInterval(interval);
  }, [allPhotos]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white shadow-2xl h-full rounded-2xl overflow-hidden w-full w-full grid md:grid-cols-2">
        
        {/* LEFT SIDE - Photo Preview */}
        <div className="bg-pink-50  flex flex-col items-center justify-center">
          {/* <h2 className="text-2xl font-bold mb-6 text-gray-700">
            Preview Your Photo
          </h2> */}

         <div className="bg-white  shadow-lg relative w-full h-full overflow-hidden">
            {allPhotos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`shot-${i}`}
                className={`
                  absolute inset-0 w-full h-full object-center object-full 
                  transition-opacity duration-700 ease-in-out
                  ${i === activeIndex ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
            <div className="absolute bottom-5 w-full flex justify-center">
              <div className="flex justify-center gap-2 mt-3">
                {allPhotos.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === activeIndex ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Waiting + QR */}
        <div className="p-10 flex flex-col justify-between">
          
          {/* Printing Status */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-spin h-6 w-6 border-4 border-teal-500 border-t-transparent rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-700">
                Printing in Progress...
              </h2>
            </div>

            <p className="text-gray-500 mb-6">
              Please wait while we prepare your photo.
            </p>

            {/* Infographic Steps */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Photo Captured</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Processing Frame</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600">Printing Photo</p>
              </div>
            </div>
          </div>

          {/* QR Download Section */}
          <div className="mt-10 bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Download Your Softcopy
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Scan this QR code to download your digital photo.
            </p>

            <div className="flex justify-center">
              <img
                src="/qr-code.png"
                alt="QR Code"
                className="w-40 h-40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waiting;