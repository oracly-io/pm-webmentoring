import React, { useCallback } from 'react'

import { EXPEL } from '@actions'
import Button from '@components/common/Button'
import Spinner from '@components/common/Spinner'
import { connect } from '@state'
import { isCommiting } from '@state/getters'

import css from './ExpelButton.module.scss'

const ExpelButton = (props) => {
  const { protegeid, commiting } = props

  const handleExpel = useCallback(() => {
    props.EXPEL({ protegeid })
  }, [protegeid])

  return (
    <div className={css.container}>
      <Button
        className={css.button}
        onClick={handleExpel}
        disabled={commiting}
      >
        {commiting ? <Spinner /> : 'Expel'}
      </Button>
    </div>
  )
}

export default connect(
  (state, { protegeid }) => {
    return {
      commiting: isCommiting(state, EXPEL, [protegeid])
    }
  },
  ({ command }) => [command(EXPEL)]
)(ExpelButton)