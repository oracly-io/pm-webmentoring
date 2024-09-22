import { isFunction } from 'lodash'
import { web3client } from '@oracly/pm-libs/crypto-wallet'
import { DEFAULT_WEB3_PROVIDER } from '@oracly/pm-libs/crypto-wallet'
import { nowUnixTS, formatUnixTS } from '@oracly/pm-libs/date-utils'
import { UserApi } from '@oracly/pm-libs/pm-api-client'
import { toHex, replace } from '@oracly/pm-libs/hash-utils'
import { ChatSocket } from '@oracly/pm-libs/pm-socket-client'

import config from '@config'
import IERC20 from '@abis/@openzeppelin/IERC20.json'
import MentoringOraclyV1 from '@abis/@oracly/MentoringOraclyV1.json'
import StakingOraclyV1 from '@abis/@oracly/StakingOraclyV1.json'
import OraclyV1 from '@abis/@oracly/OraclyV1.json'

import { GET_BALANCE } from '@actions'
import { AWAIT_TRANSACTION, CLAIM_REWARD } from '@actions'
import { EXPEL } from '@actions'
import { READ_BLOCKCHAIN_BLOCK_NUMBER } from '@actions'
import { RESOVLE_ADDRESS_TO_NICKNAME } from '@actions'
import { REQUEST_AUTHENTICATION_PSIG } from '@actions'
import { CHAT_SEND, TRANSFER_PROTEGE } from '@actions'
import { GET_BLOCKCHAIN_TABLE_PROTEGES } from '@actions'
import { GET_BLOCKCHAIN_MENTOR, GET_BLOCKCHAIN_PROTEGE } from '@actions'
import { GET_BLOCKCHAIN_MENTOR_STATISTICS } from '@actions'
import { GET_BLOCKCHAIN_STAKER_STAKE_STATISTICS } from '@actions'
import { GET_BLOCKCHAIN_STAKER_PAIDOUT_STATISTICS } from '@actions'
import { GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_ID } from '@actions'
import { GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_STATISTICS } from '@actions'
import { GET_BLOCKCHAIN_STAKER_LAST_ACTIVITY_STATISTICS } from '@actions'
import { GET_BLOCKCHAIN_STAKER_JOINED_STATISTICS } from '@actions'
import { GET_BLOCKCHAIN_BETTOR_STATISTICS  } from '@actions'
import { GET_BLOCKCHAIN_BETTOR_LAST_ACTIVITY_STATISTICS  } from '@actions'
import { GET_BLOCKCHAIN_BETTOR_JOINED_STATISTICS } from '@actions'

import { AUTH } from '@constants'

function bcreadMT(method, ...params) {
  const [,options = {}] = params
  if (!options.blockTag) delete options.blockTag
  const client = web3client.get(config.mentoring_address, MentoringOraclyV1.abi, { readonly: true })
  if (isFunction(client[method])) return client[method](...params)
  return Promise.reject('Method Not Found')
}

function bcwriteMT(method, ...params) {
  const client = web3client.get(config.mentoring_address, MentoringOraclyV1.abi)
  if (isFunction(client[method])) return client[method](...params)
  return Promise.reject('Method Not Found')
}

function bcreadST(method, ...params) {
  const [,options = {}] = params
  if (!options.blockTag) delete options.blockTag
  const client = web3client.get(config.staking_address, StakingOraclyV1.abi, { readonly: true })
  if (isFunction(client[method])) return client[method](...params)
  return Promise.reject('Method Not Found')
}

function bcreadOraclyV1(method, ...params) {
  const [,options] = params
  if (!options.blockTag) delete options.blockTag
  const client = web3client.get(config.oraclyv1_address, OraclyV1.abi, { readonly: true })
  if (isFunction(client[method])) return client[method](...params)
  return Promise.reject('Method Not Found')
}

function bcreadERC(method, erc20, ...params) {
  const [,options] = params
  if (!options.blockTag) delete options.blockTag
  const client = web3client.get(erc20, IERC20.abi, { readonly: true })
  if (isFunction(client[method])) return client[method](...params)
  return Promise.reject('Method Not Found')
}

export default {

  // CDN nickname resolution
  [RESOVLE_ADDRESS_TO_NICKNAME]: ({ address }) => UserApi.getNickname({ address }),

  // web3
  // web3auth
  [REQUEST_AUTHENTICATION_PSIG]: ({ from, nickname }) => web3client.request({ method: 'personal_sign', params: [toHex(replace(config.sig_requests[AUTH], [nickname || from, from, formatUnixTS(nowUnixTS(), 'MMM dd yyyy')])), from] }),

  // erc20
  [GET_BALANCE]: ({ erc20, account, txn: { blockNumber } = {} }) => bcreadERC('balanceOf', erc20, account, { blockTag: blockNumber }),

  // await TXN
  [AWAIT_TRANSACTION]: ({ txn: { hash } }) => web3client.waitForTransaction(hash),

  // mentoring write
  [CLAIM_REWARD]: ({ erc20 }) => bcwriteMT('claimReward', erc20, { gasLimit: 750_000 }),
  [EXPEL]: ({ protegeid }) => bcwriteMT('expelProtege', protegeid, { gasLimit: 750_000 }),
  [TRANSFER_PROTEGE]: ({ protegeid, mentorid }) => bcwriteMT('transferProtege', protegeid, mentorid, { gasLimit: 750_000 }),

  // mentoring read
  [READ_BLOCKCHAIN_BLOCK_NUMBER]: () => DEFAULT_WEB3_PROVIDER.getBlockNumber(),
  [GET_BLOCKCHAIN_TABLE_PROTEGES]: ({ mentorid, offset, txn: { blockNumber } }) => bcreadMT('getMentorProteges', mentorid, offset || 0, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_PROTEGE]: ({ protegeid, erc20, txn: { blockNumber } }) => bcreadMT('getProtege', protegeid, erc20, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_MENTOR]: ({ mentorid, erc20, txn: { blockNumber } }) => bcreadMT('getMentor', mentorid, erc20, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_MENTOR_STATISTICS]: ({ mentorid, erc20, txn: { blockNumber } }) => bcreadMT('getMentor', mentorid, erc20, { blockTag: blockNumber }),

  // staking read
  [GET_BLOCKCHAIN_STAKER_STAKE_STATISTICS]: ({ stakerid, txn: { blockNumber } }) => bcreadST('getStakeOf', stakerid, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_STAKER_PAIDOUT_STATISTICS]: ({ stakerid, erc20, txn: { blockNumber } }) => bcreadST('getStakerPaidout', stakerid, erc20, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_ID]: ({ txn: { blockNumber } }) => bcreadST('ACTUAL_EPOCH_ID', { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_STAKING_ACTUAL_EPOCH_STATISTICS]: ({ epochid, erc20, txn: { blockNumber } }) => bcreadST('getEpoch', epochid, erc20, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_STAKER_LAST_ACTIVITY_STATISTICS]: ({ stakerid, txn: { blockNumber } }) => bcreadST('getStakerDeposits', stakerid, 0, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_STAKER_JOINED_STATISTICS]: ({ stakerid, offset, txn: { blockNumber } }) => bcreadST('getStakerDeposits', stakerid, offset || 0, { blockTag: blockNumber }),

  // oracly read
  [GET_BLOCKCHAIN_BETTOR_STATISTICS]: ({ bettorid, erc20, txn: { blockNumber } }) => bcreadOraclyV1('getBettor', bettorid, erc20, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_BETTOR_LAST_ACTIVITY_STATISTICS]: ({ bettorid, txn: { blockNumber } }) => bcreadOraclyV1('getBettorPredictions', bettorid, 0, 0, { blockTag: blockNumber }),
  [GET_BLOCKCHAIN_BETTOR_JOINED_STATISTICS]: ({ bettorid, offset, txn: { blockNumber } }) => bcreadOraclyV1('getBettorPredictions', bettorid, 0, offset, { blockTag: blockNumber }),

  // chat
  [CHAT_SEND]: (params) => ChatSocket.send(params),
}
