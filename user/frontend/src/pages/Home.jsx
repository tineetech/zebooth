import React from 'react'
import { useNavigate } from 'react-router-dom'
import CheckSetup from '../components/CheckSetup'

export default function Home() {
  const nav = useNavigate()
  
  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (!checkSetupEnv) {
    return window.location.href = '/setup'
  }

  return (
    <div className='flex justify-center gap-10 items-center h-full flex-col'>
      <CheckSetup />
      <h1 className='font-bold text-white stroke-pink text-5xl'>ZeBooth</h1>
      <h1 className='text-gray-300' style={{fontStyle: 'italic'}}>Rekam, Senyum, Bagikan.</h1>
      <button className='text-uppercase' onClick={() => nav('/verify')}>
        TEKAN UNTUK MULAI
      </button>
    </div>
  )
}
