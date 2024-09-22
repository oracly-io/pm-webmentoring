import { set } from '@oracly/pm-libs/immutable'

import { SET_NETWORK_MODAL_OPEN } from '@actions'
import { SET_SHOW_STATISTICS_BAR } from '@actions'

export default {

  metadata: {
    persist: 'long',
  },

  [SET_SHOW_STATISTICS_BAR]: (state, { isOpened, account }) => {

    state = set(state, ['statisticsBarOpened'], isOpened)
    if (account) state = set(state, ['statisticsBarAccount'], account)

    return state
  },

  [SET_NETWORK_MODAL_OPEN]: (state, { isOpened }) => {

    state = set(state, ['networkModalOpened'], isOpened)

    return state
  },

}
