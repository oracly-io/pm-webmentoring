import { useRef, useEffect } from 'react'

function usePrevRefEffect(newValue) {
  const previousRef = useRef()

  useEffect(() => {
    previousRef.current = newValue
  })

  return previousRef
}

export default usePrevRefEffect