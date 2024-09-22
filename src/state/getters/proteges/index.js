import { pick } from 'lodash'
import { get } from '@oracly/pm-libs/immutable'

export function getProteges(state) {
  return get(state, ['proteges', 'collection'])
}

export function getProtegesByIds(state, ids) {
  const allproteges = getProteges(state)
  const proteges = pick(allproteges, ids)
  return proteges
}

export function getProtegesTotalSizeByAddress(state, mentorid) {
  return Number(get(state, ['proteges', 'collection_by_address_size', mentorid])) || 0
}