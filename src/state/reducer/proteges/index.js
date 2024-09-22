import { toLower } from 'lodash'
import { success } from '@oracly/pm-libs/redux-cqrs'
import { set } from '@oracly/pm-libs/immutable'

import { COMMIT_EXPEL } from '@actions'
import { GET_BLOCKCHAIN_TABLE_PROTEGES } from '@actions'
import { COMMIT_TRANSFER_PROTEGE } from '@actions'
import { GET_BLOCKCHAIN_PROTEGE } from '@actions'

import { updateEntitiesFactory } from '@state/reducer/utils'
import { blockchain2Protege, blockchain2ProtegeFund } from '@state/mappers'
import { blockchain2ProtegeFundMap, blockchain2ProtegeMap } from '@state/mappers'

export default {
  metadata: {
    default: {
      collection: {},
    },
  },

  [COMMIT_EXPEL]: (state, { mentorid }) => {

    state = set(state, ['collection_by_address_size', mentorid], (size = 1) => size - 1)

    return state
  },

  [COMMIT_TRANSFER_PROTEGE]: (state, { mentorid }) => {

    state = set(state, ['collection_by_address_size', mentorid], (size = 1) => size - 1)

    return state
  },

  [success(GET_BLOCKCHAIN_TABLE_PROTEGES)]: (state, { mentorid, txn, result }) => {

    const [bcprotegeids, size] = result
    if (size === '0') return state

    for (let bcprotegeid of bcprotegeids) {
      bcprotegeid = toLower(bcprotegeid)
      state = set(state, ['collection', bcprotegeid, 'id'], bcprotegeid)
      state = set(state, ['collection', bcprotegeid, 'protegeid'], bcprotegeid)
      state = set(state, ['collection', bcprotegeid, 'mentorid'], mentorid)
    }

    state = set(state, ['collection_by_address_size', mentorid], size)

    return state
  },

  [success(GET_BLOCKCHAIN_PROTEGE)]: (state, { protegeid, erc20, txn, result: bcprotege }) => {

    const bcprotegeMap = blockchain2ProtegeMap(bcprotege)
    const updateProtege = updateEntitiesFactory(blockchain2Protege)
    state = updateProtege(state, bcprotegeMap, txn.blockNumber)

    const bcprotegeFundMap = blockchain2ProtegeFundMap(bcprotege)
    const updateProtegeFund = updateEntitiesFactory(
      blockchain2ProtegeFund(erc20),
      () => [protegeid, 'funds', 'mentor', bcprotegeMap.mentorid, erc20],
      () => `funds.${protegeid}.${bcprotegeMap.mentorid}.${erc20}`,
    )
    state = updateProtegeFund(state, bcprotegeFundMap, txn.blockNumber)

    return state
  },

}
