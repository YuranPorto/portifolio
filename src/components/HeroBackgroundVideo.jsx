import { useState, useEffect, useRef } from 'react'
import styles from './HeroBackgroundVideo.module.css'

// Default lightweight dark abstract tech video URL (streaming CDN)
// Optimized for dark background themes with subtle motion
const DEFAULT_VIDEO_URL = 'https://assets.mixkit.co/videos/154/154-720.mp4'

export default function HeroBackgroundVideo({ 
  videoUrl = '/hero-bg.mp4', 
  fallbackUrl = DEFAULT_VIDEO_URL 
}) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [activeUrl, setActiveUrl] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    // 1. Performance check: respect user preferences (data saver & reduced motion)
    const isSaveData = navigator.connection?.saveData === true
    const isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (isSaveData || isReducedMotion) {
      // Keep static dark background for performance and accessibility
      return
    }

    // 2. Defer video loading until after initial page paint and critical resources are ready
    const timer = setTimeout(() => {
      // Use requestIdleCallback if available, or load immediately after timeout
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          setShouldLoadVideo(true)
          setActiveUrl(videoUrl)
        })
      } else {
        setShouldLoadVideo(true)
        setActiveUrl(videoUrl)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [videoUrl])

  // Handle fallback if custom local file is not found (404)
  const handleVideoError = () => {
    if (activeUrl !== fallbackUrl && fallbackUrl) {
      console.info('Switching to fallback hero background video stream...')
      setActiveUrl(fallbackUrl)
      setIsLoaded(false)
    } else {
      // Both failed, gracefully keep static dark background
      setActiveUrl(null)
      setIsLoaded(false)
    }
  }

  const handleVideoReady = () => {
    setIsLoaded(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: keep muted and try again
        if (videoRef.current) {
          videoRef.current.muted = true
          videoRef.current.play().catch(() => {})
        }
      })
    }
  }

  return (
    <div className={styles.heroBgContainer} aria-hidden="true">
      {/* 1. Instant Static Dark Poster (Zero blocking, 100% performance) */}
      <div className={styles.staticPoster} />

      {/* 2. Deferred Video Element (fades in only when ready) */}
      {shouldLoadVideo && activeUrl && (
        <video
          ref={videoRef}
          src={activeUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={`${styles.videoElement} ${isLoaded ? styles.videoVisible : ''}`}
          onCanPlayThrough={handleVideoReady}
          onLoadedData={handleVideoReady}
          onError={handleVideoError}
        />
      )}

      {/* 3. Dark Editorial Vignette Overlays for Maximum Text Contrast */}
      <div className={styles.overlayShade} />
      <div className={styles.overlayGrid} />
    </div>
  )
}

