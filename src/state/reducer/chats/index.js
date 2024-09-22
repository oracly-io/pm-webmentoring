import { isEmpty, castArray } from 'lodash'
import { set, del } from '@oracly/pm-libs/immutable'

import {
  CHAT_CONNECTED,
  CHAT_DISCONNECTED,
  CHAT_RECEIVE,
} from '@state/actions'
import { SUBSCRIBE_MSG, UNSUBSCRIBE_MSG } from '@constants'
import { CHAT_ENGLISH } from '@constants'

export default {

  metadata: {
    default: {
      active: { channel: CHAT_ENGLISH }
    }
  },

  [CHAT_RECEIVE]: (state, { message, messages }) => {

    if (isEmpty(message) && isEmpty(messages)) messages = []
    if (isEmpty(messages)) messages = castArray(message)

    for (const msg of messages) {
      if (msg.type === SUBSCRIBE_MSG) {
        state = set(state, ['subscribed', msg.sender, msg.channel], msg.channel)
      } else if (msg.type === UNSUBSCRIBE_MSG) {
        state = del(state, ['subscribed', msg.sender, msg.channel])
      }

    }

    return state

  },

  [CHAT_CONNECTED]: (state) => {

    state = set(state, ['connected'], true)

    return state
  },

  [CHAT_DISCONNECTED]: (state) => {

    state = set(state, ['connected'], false)
    state = del(state, ['subscribed'])

    return state
  },

}
