import { isEmpty, isEqual, toLower } from 'lodash'
import { success } from '@oracly/pm-libs/redux-cqrs'
import { get, set } from '@oracly/pm-libs/immutable'

import { COMMIT_EXPEL, COMMIT_TRANSFER_PROTEGE } from '@actions'
import { GET_BLOCKCHAIN_TABLE_PROTEGES } from '@actions'
import { LT } from '@constants'
import { createProtegesTableFilter } from '@utils'

function updateEntities(state, tableName, entityids) {
  const prevEntityids = get(state, [tableName, 'data'])
  if(!isEqual(prevEntityids, entityids)) {
    state = set(state, [tableName, 'data'], entityids)
  }
  return state
}

function addEntities(state, tableName, entityids, before) {
  if (!isEmpty(entityids)) {
    state = set(state, [tableName, 'data'], (eids) => {
      return before ? entityids.concat(eids) : eids.concat(entityids)
    })
  }
  return state
}

function updateFilter(state, tableName, nextFilter) {
  const prevFilter = get(state, [tableName, 'filter'])

  if(!isEqual(prevFilter, nextFilter)) {
    state = set(state, [tableName, 'filter'], nextFilter)
  }

  return state
}

function removeEntity(state, tableName, id) {
  state = set(state, [tableName, 'data'], (ids) => {
    const index = ids.indexOf(id)
    if (index !== -1) ids.splice(index, 1)
    return [...ids]
  })
}

export default {
  metadata: {
    default: {
      proteges: {
        data: [],
      },
    },
  },

  [GET_BLOCKCHAIN_TABLE_PROTEGES]: (state, { mentorid }) => {

    const filter = createProtegesTableFilter(mentorid)
    state = updateFilter(state, 'proteges', filter)

    return state
  },

  [success(GET_BLOCKCHAIN_TABLE_PROTEGES)]: (state, { loadType, result: [bcprotegeids] }) => {

    const proteges = bcprotegeids
      .map((id) => toLower(id))
      .filter((id) => !get(state, ['proteges', 'data'])?.includes(id))

    if (loadType === LT.SCROLL) {
      state = addEntities(state, 'proteges', proteges)
    } else if (loadType === LT.FILL_PAGE) {
      state = addEntities(state, 'proteges', proteges)
    } else if (loadType === LT.LOAD_NEW) {
      state = addEntities(state, 'proteges', proteges, true)
    } else {
      state = updateEntities(state, 'proteges', proteges)
    }

    return state
  },

  [COMMIT_EXPEL]: (state, { protegeid, mentorid }) => {

    const filter = createProtegesTableFilter(mentorid)
    const currentFilter = get(state, ['proteges', 'filter'])

    if (isEqual(filter, currentFilter)) {
      state = removeEntity(state, 'proteges', protegeid)
    }

    return state
  },

  [COMMIT_TRANSFER_PROTEGE]: (state, { protegeid, mentorid }) => {

    const filter = createProtegesTableFilter(mentorid)
    const currentFilter = get(state, ['proteges', 'filter'])

    if (isEqual(filter, currentFilter)) {
      state = removeEntity(state, 'proteges', protegeid)
    }

    state = removeEntity(state, 'proteges', protegeid)

    return state
  },
}
