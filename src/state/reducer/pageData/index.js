import { set } from '@oracly/pm-libs/immutable'

import config from '@config'

import { SET_PAGE_DATA } from '@actions'
import { ERC20, USDC_ADDRESS } from '@constants'

export default {
  metadata: {
    persist: 'long',
    default: {
      erc20: ERC20.ADDRESS[config.default_currency] || USDC_ADDRESS
    },
  },

  [SET_PAGE_DATA]: (state, data = {}) => {

    for(const property in data) {
      state = set(state, property, data[property])
    }

    return state
  },

}
