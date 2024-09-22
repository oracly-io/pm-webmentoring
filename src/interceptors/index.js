import { isString, has, get, concat } from 'lodash'
import { findAction, query, command, success } from '@oracly/pm-libs/redux-cqrs'

import { AWAIT_TRANSACTION, GET_BALANCE } from '@actions'
import { CLAIM_REWARD, GET_BLOCKCHAIN_MENTOR } from '@actions'
import { EXPEL, COMMIT_EXPEL } from '@actions'
import { TRANSFER_PROTEGE, COMMIT_TRANSFER_PROTEGE } from '@actions'

import { TXN_COMMITED } from '@constants'
import { LT } from '@constants'
import { getActiveAccountAddress, getPageDataERC20 } from '@state/getters'

export default {
  cryptoTXN: {
    detect: (action) => {
      const path = ['args', 'result']
      return (
        has(action, concat(path, 'hash')) &&
        has(action, concat(path, 'blockNumber')) &&
        has(action, concat(path, 'blockHash'))
      )
    },
    intercept: (action, store) => {
      const txn = get(action, ['args', 'result'])
      if (isString(txn.hash) && Number(txn.hash)) {
        store.dispatch(query(
          AWAIT_TRANSACTION,
          { txn },
          { origin: action }
        ))
      }
    }
  },
  updateBalance: {
    detect: (action) => action.type === success(AWAIT_TRANSACTION),
    intercept: (action, store) => {
      const account = getActiveAccountAddress(store.getState())
      const erc20 = getPageDataERC20(store.getState())
      const blockNumber = get(action, ['args', 'result', 'blockNumber'])
      store.dispatch(query(
        GET_BALANCE,
        { account, erc20, txn: { blockNumber } },
        { origin: action }
      ))
    }
  },
  commitTXN: {
    detect: (action) => {
      const txnStatus = get(action, ['args', 'result', 'status'])
      return action.type === success(AWAIT_TRANSACTION) && txnStatus === TXN_COMMITED
    },
    intercept: (action, store) => {
      const blockNumber = get(action, ['args', 'result', 'blockNumber'])

      const action_CLAIM_REWARD = findAction(action, success(CLAIM_REWARD))
      if (action_CLAIM_REWARD) {
        const { erc20, mentorid } = action_CLAIM_REWARD.args
        store.dispatch(query(
          GET_BLOCKCHAIN_MENTOR,
          { mentorid, erc20, loadType: LT.UPDATE, txn: { blockNumber } }
        ))
      }

      const action_EXPEL = findAction(action, success(EXPEL))
      if (action_EXPEL) {
        const { protegeid } = action_EXPEL.args
        const mentorid = getActiveAccountAddress(store.getState())
        store.dispatch(command(
          COMMIT_EXPEL,
          { protegeid, mentorid },
          { origin: action }
        ))
      }

      const action_TRANSFER_PROTEGE = findAction(action, success(TRANSFER_PROTEGE))
      if (action_TRANSFER_PROTEGE) {
        const { protegeid } = action_TRANSFER_PROTEGE.args
        const mentorid = getActiveAccountAddress(store.getState())
        store.dispatch(command(
          COMMIT_TRANSFER_PROTEGE,
          { protegeid, mentorid },
          { origin: action }
        ))
      }
    }
  },
}
