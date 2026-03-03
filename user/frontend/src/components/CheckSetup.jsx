import React from 'react'
import { useNavigate } from 'react-router-dom'

const CheckSetup = () => {
    
  const nav = useNavigate()
  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (!checkSetupEnv) {
    return window.location.href = '/setup'
  }
  return (
    <></>
  )
}

export default CheckSetup