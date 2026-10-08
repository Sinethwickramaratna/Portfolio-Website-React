import { useEffect, useRef } from 'react'

/** Fades a block in once, the first time it scrolls into view. */
export default function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const Tag = as
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // Also reveal anything already scrolled past (e.g. after an anchor jump).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          el.classList.add('in')
          cleanup()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    io.observe(el)

    // A fast scroll or anchor jump can skip a block between two observer frames, so also check on scroll.
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('in')
        cleanup()
      }
    }
    const cleanup = () => {
      io.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return cleanup
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
