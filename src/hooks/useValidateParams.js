import { useMatches, useParams } from 'react-router-dom'

const useValidateParams = () => {
  const params = useParams()
  const matches = useMatches()

  return matches
    .filter((match) => match?.handle?.validator)
    .map((match) => match.handle.validator)
    .reduce((prev, validator) => prev && validator({ params }), true)
}

export default useValidateParams