import { useEffect } from 'react'
import { throttle } from 'lodash'

const useInfiniteScroll = (callback, deps) => {
  useEffect(() => {
    let prevScrollTop
    const handler = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const isScrollingDown = prevScrollTop < scrollTop
      prevScrollTop = scrollTop

      if (isScrollingDown) {
        const loadOffset = scrollHeight - clientHeight - clientHeight * 0.2 // bottom 20%

        if (scrollTop > loadOffset) callback()

        const maxScrollTop = scrollHeight - clientHeight - 1
        if (scrollTop > maxScrollTop) {
          window.scrollTo(0, maxScrollTop)
          prevScrollTop = maxScrollTop
        }
      }
    }, 500)

    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, deps)
}

export default useInfiniteScroll