import { rootReducer, combine } from '@lib/reducer-utils'

import auth from './auth'
import application from './application'
import asyncStatus from './asyncStatus'
import pageData from './pageData'
import table from './table'
import mentors from './mentors'
import proteges from './proteges'
import statistics from './statistics'
import blockchain from './blockchain'
import users from './users'
import chats from './chats'
import ui from './ui'

const rootCombination = combine({
  auth,
  application,
  asyncStatus,
  pageData,
  table,
  statistics,
  mentors,
  proteges,
  chats,
  blockchain,
  users,
  ui,
})

export default rootReducer(rootCombination)
