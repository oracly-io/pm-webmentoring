import { nowUnixTS } from '@oracly/pm-libs/date-utils'
import { get, set } from '@oracly/pm-libs/immutable'
import { success } from '@oracly/pm-libs/redux-cqrs'

import { READ_BLOCKCHAIN_BLOCK_NUMBER } from '@state/actions'

export default {

  [success(READ_BLOCKCHAIN_BLOCK_NUMBER)]: (state, { result: blockNumber }) => {

    const number = Number(blockNumber)
    if (!number) return state

    const latest = get(state, ['latest_bc', 'number'])
    if (!latest || number > latest) {
      state = set(state, ['latest_bc', 'number'], number)
      state = set(state, ['latest_bc', 'timestamp'], nowUnixTS())
    }

    return state
  },

}
