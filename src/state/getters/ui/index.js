import { get } from '@oracly/pm-libs/immutable'

export function getStatisticsBarIsOpened(state) {
  return get(state, ['ui', 'statisticsBarOpened'])
}

export function getStatisticsBarAccount(state) {
  return get(state, ['ui', 'statisticsBarAccount'])
}

export function getNetworkModalIsOpened(state) {
  return get(state, ['ui', 'networkModalOpened'])
}