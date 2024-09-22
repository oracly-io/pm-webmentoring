import { curryRight, isEmpty } from 'lodash'
import { toDecimalERC20 } from '@oracly/pm-libs/calc-utils'

import { blockchain2EntityMap } from '@utils'

export const PROTEGE_BC = {
  'id'            : '0',
  'protegeid'     : '0',
  'mentorid'      : '1',
  'createdAt'     : '4',
  'updatedAt'     : '5',
}
export const blockchain2ProtegeMap = curryRight(blockchain2EntityMap)(PROTEGE_BC)

export function blockchain2Protege(protegeMap, funds) {

  const protege = { ...protegeMap }

  if (!isEmpty(funds)) protege.funds = funds

	return protege

}

export const PROTEGE_FUND_BC = {
  'earned'      : '3',
  'earnedTotal' : '4',
}
export const blockchain2ProtegeFundMap = curryRight(blockchain2EntityMap)(PROTEGE_FUND_BC)
export function blockchain2ProtegeFund(erc20) {
  return ({ earned, earnedTotal }) => ({
    earned: toDecimalERC20(earned, erc20),
    earnedTotal: toDecimalERC20(earnedTotal, erc20),
  })
}