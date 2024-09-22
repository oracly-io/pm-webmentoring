import { findAction } from '@oracly/pm-libs/redux-cqrs'

import {
  AWAIT_TRANSACTION,
  CLAIM_REWARD,
  EXPEL,
  GET_BLOCKCHAIN_TABLE_PROTEGES,
  RESOVLE_ADDRESS_TO_NICKNAME,
  WALLET_CONNECT,
  TRANSFER_PROTEGE,
  GET_BLOCKCHAIN_MENTOR,
  GET_BLOCKCHAIN_PROTEGE,

  GET_BLOCKCHAIN_MENTOR_STATISTICS,
  GET_BLOCKCHAIN_STAKER_JOINED_STATISTICS,
  GET_BLOCKCHAIN_STAKER_PAIDOUT_STATISTICS,
  GET_BLOCKCHAIN_STAKER_LAST_ACTIVITY_STATISTICS,
  GET_BLOCKCHAIN_STAKER_STAKE_STATISTICS,
  GET_BLOCKCHAIN_BETTOR_STATISTICS,
  GET_BLOCKCHAIN_BETTOR_JOINED_STATISTICS,
  GET_BLOCKCHAIN_BETTOR_LAST_ACTIVITY_STATISTICS,
  GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_STATISTICS,
  GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_ID,
} from '@actions'
import { reducer } from '@state/async'
import { combine } from '@lib/reducer-utils'

export default combine({
  [WALLET_CONNECT]: reducer(WALLET_CONNECT),
  [CLAIM_REWARD]: reducer(CLAIM_REWARD),
  [EXPEL]: reducer(EXPEL, ({ protegeid }) => protegeid),
  [TRANSFER_PROTEGE]: reducer(TRANSFER_PROTEGE, ({ protegeid }) => protegeid),
  [AWAIT_TRANSACTION]: reducer(AWAIT_TRANSACTION, (_, { origin }) => {
    const action_CLAIM_REWARD = findAction(origin, CLAIM_REWARD)
    if (action_CLAIM_REWARD) return CLAIM_REWARD
    const action_EXPEL = findAction(origin, EXPEL)
    if (action_EXPEL) return `${EXPEL}.${action_EXPEL.args.protegeid}`
    const action_TRANSFER_PROTEGE = findAction(origin, TRANSFER_PROTEGE)
    if (action_TRANSFER_PROTEGE) return `${TRANSFER_PROTEGE}.${action_TRANSFER_PROTEGE.args.protegeid}`
  }),
  [RESOVLE_ADDRESS_TO_NICKNAME]: reducer(RESOVLE_ADDRESS_TO_NICKNAME, ({ loadType, address }) =>
    [address, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_TABLE_PROTEGES]: reducer(GET_BLOCKCHAIN_TABLE_PROTEGES, ({ loadType }) => ['', loadType]),
  [GET_BLOCKCHAIN_MENTOR]: reducer(GET_BLOCKCHAIN_MENTOR, ({ mentorid, erc20, loadType }) =>
    [mentorid, erc20, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_PROTEGE]: reducer(GET_BLOCKCHAIN_PROTEGE, ({ protegeid, erc20, loadType }) =>
    [protegeid, erc20, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_BETTOR_STATISTICS]: reducer(GET_BLOCKCHAIN_BETTOR_STATISTICS, ({ loadType, bettorid }) =>
    [bettorid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_BETTOR_LAST_ACTIVITY_STATISTICS]: reducer(GET_BLOCKCHAIN_BETTOR_LAST_ACTIVITY_STATISTICS, ({ loadType, bettorid }) =>
    [bettorid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_BETTOR_JOINED_STATISTICS]: reducer(GET_BLOCKCHAIN_BETTOR_JOINED_STATISTICS, ({ loadType, bettorid }) =>
    [bettorid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_STAKER_STAKE_STATISTICS]: reducer(GET_BLOCKCHAIN_STAKER_STAKE_STATISTICS, ({ loadType, stakerid }) =>
    [stakerid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_STAKER_LAST_ACTIVITY_STATISTICS]: reducer(GET_BLOCKCHAIN_STAKER_LAST_ACTIVITY_STATISTICS, ({ loadType, stakerid }) =>
    [stakerid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_STAKER_PAIDOUT_STATISTICS]: reducer(GET_BLOCKCHAIN_STAKER_PAIDOUT_STATISTICS, ({ loadType, stakerid }) =>
    [stakerid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_STAKER_JOINED_STATISTICS]: reducer(GET_BLOCKCHAIN_STAKER_JOINED_STATISTICS, ({ loadType, stakerid }) =>
    [stakerid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_MENTOR_STATISTICS]: reducer(GET_BLOCKCHAIN_MENTOR_STATISTICS, ({ loadType, mentorid }) =>
    [mentorid, loadType].filter(i => i).join('.')
  ),
  [GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_ID]: reducer(GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_ID,  ({ loadType }) => loadType),
  [GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_STATISTICS]: reducer(GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_STATISTICS,  ({ loadType }) => loadType),
})
