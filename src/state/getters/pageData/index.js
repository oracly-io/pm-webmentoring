import { get } from '@oracly/pm-libs/immutable'

function getPageData(state) {
  const data = get(state, ['pageData'])
  return data
}

export function getPageDataERC20(state) {
  const data = getPageData(state)
  const erc20 = get(data, 'erc20')

  return erc20
}