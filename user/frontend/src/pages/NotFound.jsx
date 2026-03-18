import React from 'react'

const NotFound = () => {
  
  const checkSetupEnv = localStorage.getItem('setup-roombox')

  if (!checkSetupEnv) {
    return window.location.href = '/setup'
  }
  return (
    <div>NotFound</div>
  )
}

export default NotFound