import { isObject, mapValues, toLower } from 'lodash'
import { sub } from '@oracly/pm-libs/calc-utils'
import { nowUnixTS } from '@oracly/pm-libs/date-utils'
import { get } from '@oracly/pm-libs/immutable'
import { numericHash } from '@oracly/pm-libs/hash-utils'

import config from '@config'
import { NETWORK_STATUS } from '@constants'

export function getMentorErc20Funds(mentor, erc20) {
  const claimed = get(mentor, ['funds', erc20, 'claimed']) || 0
  const earned = get(mentor, ['funds', erc20, 'earned']) || 0
  const unclaimed = sub(earned, claimed) || 0

  return {
    claimed,
    unclaimed,
    earned,
  }
}

export function createProtegesTableFilter(mentorid) {
  return { mentorid }
}

export function blockchain2EntityMap(bcentity, ENTITY_BC_MAP) {
  return mapValues(ENTITY_BC_MAP, (key) => {
    const value = isObject(bcentity) ? get(bcentity, key) : bcentity
    return typeof value === 'string' ? toLower(value) : value
  })
}

export function toAccountAvatarUrl(address) {
  return `${config.userdata_ava_url + '/' + numericHash(address) % config.userdata_ava_count}.png`
}

const checkObsolete = (timestamp) => {
  if (!timestamp) return false
  const age = nowUnixTS() - timestamp
  return !!(age >= config.obsolit_data_limit_age)
}
export function determineNetworkStatus(bcblock, isOnline) {
  if (!isOnline) return NETWORK_STATUS.ERROR
  if (checkObsolete(bcblock?.timestamp)) return NETWORK_STATUS.WARNING
  return NETWORK_STATUS.SUCCESS
}