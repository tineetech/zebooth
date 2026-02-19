import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import SelectTemplate from './pages/SelectTemplate'
import Camera from './pages/Camera'
import Preview from './pages/Preview'
import Result from './pages/Result'
import NotFound from './pages/NotFound'
import Main from './layouts/Main'
import Verify from './pages/Verify'

function App() {
  
  return (
    <Main>
      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Home />} />

          {/* Flow photobooth */}
          <Route path="/verify" element={<Verify />} />
          <Route path="/template" element={<SelectTemplate />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/result" element={<Result />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Main>
  )
}

export default App
