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
import Panduan from './pages/Panduan'
import Filter from './pages/Filter'
import Setup from './pages/Setup'
import Waiting from './pages/Waiting'

function App() {
  
  return (
    <Main>
      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Home />} />

          {/* Flow photobooth */}
          <Route path="/setup" element={<Setup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/template" element={<SelectTemplate />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/print" element={<Preview />} />
          <Route path="/result" element={<Result />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Main>
  )
}

export default App
