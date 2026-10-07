import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'

// Secondary pages are code-split; most visitors never open them.
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'))
const CertificatesPage = lazy(() => import('./pages/CertificatesPage.jsx'))
const CattleBlog = lazy(() => import('./pages/CattleBlog.jsx'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/blog/cattle-behavior-iot-ml" element={<CattleBlog />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  )
}
