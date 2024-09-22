import { get } from '@oracly/pm-libs/immutable'

export function getTable(state) {
  const table = get(state, 'table')

  return table
}

export function getTableProteges(state) {
  const table = getTable(state)

  return get(table, ['proteges', 'data'])
}

export function getTableProtegesFilter(state) {
  const table = getTable(state)

  return get(table, ['proteges', 'filter'])
}
