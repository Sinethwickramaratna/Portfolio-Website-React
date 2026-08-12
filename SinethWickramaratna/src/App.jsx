import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import AetherPage from './aether/AetherPage.jsx'

/* The previous build shipped an ambient samurai-flute track and a
   floating audio toggle. Both belonged to the old identity, and the
   track alone was a 9.8 MB asset — removed with the rest of that
   design. The hook and control components are still in the tree if a
   soundtrack is wanted back. */

// Secondary routes are code-split: the universe is the primary
// experience and should not wait on pages most visitors never open.
const GalleryPage = lazy(() => import('./Components/GalleryPage.jsx'))
const CertificatesPage = lazy(() => import('./Components/CertificatesPage.jsx'))
const CattleBehaviorBlog = lazy(() =>
  import('./Components/BlogPages/CattleBehaviorBlog.jsx')
)

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<AetherPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route
          path="/blog/cattle-behavior-iot-ml"
          element={<CattleBehaviorBlog />}
        />
      </Routes>
    </Suspense>
  )
}

export default App
