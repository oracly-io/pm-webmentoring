import React from 'react'
import PropTypes from 'prop-types'

import { GET_BLOCKCHAIN_PROTEGE } from '@actions'
import { DateCell } from '@components/common/cells'
import Spinner from '@components/common/Spinner'
import { connect } from '@state'
import { isInitialLoading } from '@state/getters'

const JoinedAtCell = ({ date, isLoading }) => {
  return isLoading ? (
    <Spinner />
  ) : (
    <DateCell date={date} />
  )
}

JoinedAtCell.propTypes = {
  protegeid: PropTypes.string.isRequired,
  erc20: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default connect(
  (state, { protegeid, erc20 }) => ({
    isLoading: isInitialLoading(state, GET_BLOCKCHAIN_PROTEGE, [protegeid, erc20])
  })
)(
  React.memo(JoinedAtCell)
)
