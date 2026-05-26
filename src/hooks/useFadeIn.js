import { useEffect } from 'react'

export function useFadeIn(containerRef) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = container.querySelectorAll('.fade-up')
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    targets.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [containerRef])
}
