import { ActionScheduler } from '@oracly/pm-libs/action-scheduler'
import { query, command } from '@oracly/pm-libs/redux-cqrs'

const initActionsScheduler = (store) => {
  const mergers = {}

  ActionScheduler.init({
    query: { store, mergers, dispatch: (name, args) => store.dispatch(query(name, args)) },
    command: { store, dispatch: (name, args) => store.dispatch(command(name, args)) },
  })
}

export default initActionsScheduler
