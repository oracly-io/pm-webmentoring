import { get } from '@oracly/pm-libs/immutable'

import { ERC20 } from '@constants'

export function getMentors(state) {
  const mentors = get(state, ['mentors', 'collection'])
  return mentors
}

export function getMentor(state, mentorid) {
  const mentors = getMentors(state)
  const mentor = get(mentors, [mentorid])
  return mentor
}

export function getAccountByAddress(state, address) {
  const account = get(state, ['mentors', 'accounts', address])
  return account
}

export function getActiveAccountAddress(state) {
  const address = get(state, ['mentors', 'active'])
  return address
}

export function getActiveAccountBalanceERC20(state, erc20) {
  return getActiveAccountBalance(state, ERC20[erc20])
}

export function getActiveAccountBalance(state, currency) {
  const address = getActiveAccountAddress(state)
  const account = getAccountByAddress(state, address)
  const balance = get(account, ['balance', currency, 'amount'])
  return balance
}