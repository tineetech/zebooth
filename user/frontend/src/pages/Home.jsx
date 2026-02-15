import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const nav = useNavigate()
//   document.documentElement.requestFullscreen()

  return (
    <div>
      <h1>Welcome Photobooth</h1>
      <button onClick={() => nav('/template')}>
        Start
      </button>
    </div>
  )
}
