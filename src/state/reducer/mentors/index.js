import { toLower } from 'lodash'
import { toDecimalERC20 } from '@oracly/pm-libs/calc-utils'
import { get, set } from '@oracly/pm-libs/immutable'
import { success } from '@oracly/pm-libs/redux-cqrs'

import { SET_ACCOUNT, GET_BALANCE } from '@actions'
import { GET_BLOCKCHAIN_MENTOR } from '@actions'
import { ERC20 } from '@constants'
import { updateEntitiesFactory } from '@state/reducer/utils'
import { blockchain2Mentor, blockchain2MentorFund } from '@state/mappers'
import { blockchain2MentorFundMap, blockchain2MentorMap } from '@state/mappers'

export default {

  metadata: {
    default: {
      collection: {},
      active: ''
    },
  },

  [SET_ACCOUNT]: (state, { account }) => {
    state = set(state, ['active'], toLower(account))
    return state
  },

  [success(GET_BALANCE)]: (state, { account, erc20, result, txn: { blockNumber } }) => {

    const prevBlockNumber = get(state, [
      'accounts',
      toLower(account),
      'balance',
      ERC20[erc20],
      'blockNumber',
    ])

    if (blockNumber > prevBlockNumber || !prevBlockNumber) {
      state = set(
        state,
        ['accounts', toLower(account), 'balance', ERC20[erc20]],
        { amount: toDecimalERC20(result.toString(), erc20), blockNumber },
      )
    }

    return state

  },

  [success(GET_BLOCKCHAIN_MENTOR)]: (state, { mentorid, erc20, txn, result: bcmentor }) => {

    const bcmentorMap = blockchain2MentorMap(bcmentor)
    const updateMentor = updateEntitiesFactory(blockchain2Mentor)
    state = updateMentor(state, bcmentorMap, txn.blockNumber)

    const bcmentorFundMap = blockchain2MentorFundMap(bcmentor)
    const updateMentorFund = updateEntitiesFactory(
      blockchain2MentorFund(erc20),
      () => [mentorid, 'funds', erc20],
      () => `funds.${mentorid}.${erc20}`,
    )
    state = updateMentorFund(state, bcmentorFundMap, txn.blockNumber)

    return state
  },

}
