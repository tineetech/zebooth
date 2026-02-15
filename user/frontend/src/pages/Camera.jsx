import React, { useEffect, useRef, useState } from 'react'

export default function Camera() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      })
      videoRef.current.srcObject = media
      setStream(media)
    } catch (err) {
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop())
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const data = canvas.toDataURL('image/png')
    setPhoto(data)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Camera</h2>

      {!photo && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: 500, borderRadius: 12 }}
          />
          <br />
          <button onClick={capturePhoto}>Capture</button>
        </>
      )}

      {photo && (
        <>
          <h3>Preview</h3>
          <img src={photo} width={400} />
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
