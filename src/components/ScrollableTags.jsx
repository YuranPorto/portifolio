import { useRef, useState } from 'react'
import styles from './ScrollableTags.module.css'

export default function ScrollableTags({ tags = [], className = '' }) {
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragInfo = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false
  })

  if (!tags || tags.length === 0) return null

  const handleMouseDown = (e) => {
    // Only left click
    if (e.button !== 0) return
    const container = containerRef.current
    if (!container) return

    dragInfo.current.isDown = true
    dragInfo.current.hasMoved = false
    dragInfo.current.startX = e.pageX - container.offsetLeft
    dragInfo.current.scrollLeft = container.scrollLeft
    setIsDragging(true)
  }

  const handleMouseLeave = () => {
    dragInfo.current.isDown = false
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    dragInfo.current.isDown = false
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!dragInfo.current.isDown) return
    const container = containerRef.current
    if (!container) return

    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - dragInfo.current.startX) * 1.5
    if (Math.abs(walk) > 3) {
      dragInfo.current.hasMoved = true
    }
    container.scrollLeft = dragInfo.current.scrollLeft - walk
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.tagContainer} ${isDragging ? styles.isDragging : ''} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {tags.map((tag, idx) => (
        <span key={idx} className={styles.tagPill}>
          {tag}
        </span>
      ))}
    </div>
  )
}

