import { toLower, isString } from 'lodash'
import { success, fails } from '@oracly/pm-libs/redux-cqrs'
import { get, set } from '@oracly/pm-libs/immutable'

import { UPDATE_NICKNAME } from '@actions'
import { RESOVLE_ADDRESS_TO_NICKNAME } from '@actions'

import { UNPUBLISHED } from '@constants'

export default {

  metadata: {
    persist: 'short'
  },

  [UPDATE_NICKNAME]: (state, { address, nickname }) => {

    state = set(state, [toLower(address), 'nickname'], nickname)
    state = set(state, [toLower(address), 'status'], UNPUBLISHED)

    return state
  },

  [success(RESOVLE_ADDRESS_TO_NICKNAME)]: (state, { address, result: { nickname } }) => {

    // NOTE: empty string as nickname
    // marks success resolution to empty nickname
    nickname = nickname || ''
    const unpublished = get(state, [toLower(address), 'status']) === UNPUBLISHED
    if (unpublished) {
      state = set(state, [toLower(address), 'public_nickname'], nickname)
    } else {
      state = set(state, [toLower(address), 'nickname'], nickname)
    }

    return state
  },

  [fails(RESOVLE_ADDRESS_TO_NICKNAME)]: (state, { address }) => {

    const unpublished = get(state, [toLower(address), 'status']) === UNPUBLISHED
    if (unpublished) {

      if (!isString(state, [toLower(address), 'public_nickname'])) {
        state = set(state, [toLower(address), 'public_nickname'], '')
      }

    } else {

      if (!isString(get(state, [toLower(address), 'nickname']))) {
        state = set(state, [toLower(address), 'nickname'], '')
      }

    }

    return state
  },

}
