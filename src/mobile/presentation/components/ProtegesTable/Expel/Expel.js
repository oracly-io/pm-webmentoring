import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { EXPEL } from '@actions'
import { connect } from '@state'
import { isCommiting } from '@state/getters'

import Action from '../Action'

const Expel = (props) => {
  const { protegeid, commiting } = props

  const handleExpel = useCallback(() => {
    props.EXPEL({ protegeid })
  }, [protegeid])

  return (
    <Action label="Expel" isLoading={commiting} onClick={handleExpel} />
  )
}

Expel.propTypes = {
  protegeid: PropTypes.string.isRequired
}

export default connect(
  (state, { protegeid }) => {
    return {
      commiting: isCommiting(state, EXPEL, [protegeid])
    }
  },
  ({ command }) => [command(EXPEL)]
)(Expel)