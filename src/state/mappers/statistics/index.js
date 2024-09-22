import { curryRight } from 'lodash'

import { blockchain2EntityMap } from '@utils'

export const BC_EPOCH_MAP = {
  'id'        : '0.0',
  'epochid'   : '0.0',
  'startDate' : '0.1',
  'endDate'   : '0.2',
  'startedAt' : '0.3',
  'endedAt'   : '0.4',
  'stakes'    : '1.0',
  'stakefund' : '2.0',
}
export const blockchain2EpochMap = curryRight(blockchain2EntityMap)(BC_EPOCH_MAP)

export const DEPOSIT_BC = {
  'id'            : '0',
  'depositid'     : '0',
  'staker'        : '1',
  'epochStaked'   : '2', // inEpochid
  'stakedAt'      : '3', // createdAt
  'stake'         : '4', // amount
  'epochUnstaked' : '5', // outEpochid
  'unstaked'      : '6',
  'withdrawn'     : '7',
  'withdrawnAt'   : '8',
}

export const blockchain2DepositMap = curryRight(blockchain2EntityMap)(DEPOSIT_BC)

export const PREDICTION_BC = {
  'predictionid' : '0',
  'roundid'      : '1',
  'gameid'       : '2',
  'bettor'       : '3',
  'position'     : '4',
  'wager'        : '5',
  'claimed'      : '6',
  'createdAt'    : '7',
  'payout'       : '8',
  'commission'   : '9',
  'erc20'        : '10',
}
export const blockchain2PredictionMap = curryRight(blockchain2EntityMap)(PREDICTION_BC)

export const BETTOR_BC = {
  'id'               : '0',
  'predictionsTotal' : '1.0',
  'depositTotal'     : '2.0',
  'paidoutTotal'     : '3.0',
}
export const blockchain2BettorMap = curryRight(blockchain2EntityMap)(BETTOR_BC)
