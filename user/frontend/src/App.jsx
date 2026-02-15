import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import SelectTemplate from './pages/SelectTemplate'
import Camera from './pages/Camera'
import Preview from './pages/Preview'
import Result from './pages/Result'
import NotFound from './pages/NotFound'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Home />} />

        {/* Flow photobooth */}
        <Route path="/template" element={<SelectTemplate />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/result" element={<Result />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
