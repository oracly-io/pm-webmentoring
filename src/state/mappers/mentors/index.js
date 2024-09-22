import { curryRight, isEmpty } from 'lodash'
import { toDecimalERC20 } from '@oracly/pm-libs/calc-utils'

import { blockchain2EntityMap } from '@utils'

export const MENTOR_BC = {
  'id'          : '0',
  'mentorid'    : '0',
  'circle'      : '1',
  'createdAt'   : '4',
  'updatedAt'   : '5',
}
export const blockchain2MentorMap = curryRight(blockchain2EntityMap)(MENTOR_BC)
export function blockchain2Mentor(mentorMap, funds) {

  const mentor = { ...mentorMap }

  if (!isEmpty(funds)) mentor.funds = funds

	return mentor

}

export const MENTOR_FUND_BC = {
  'earned'     : '2',
  'claimed'    : '3',
}
export const blockchain2MentorFundMap = curryRight(blockchain2EntityMap)(MENTOR_FUND_BC)
export function blockchain2MentorFund(erc20) {
  return ({ earned, claimed }) => ({
    earned: toDecimalERC20(earned, erc20),
    claimed: toDecimalERC20(claimed, erc20),
  })
}