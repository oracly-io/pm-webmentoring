import React from 'react'
import PropTypes from 'prop-types'

import { GET_BLOCKCHAIN_PROTEGE } from '@actions'
import { RewardCell } from '@components/common/cells'
import Spinner from '@components/common/Spinner'
import { connect } from '@state'
import { isInitialLoading } from '@state/getters'

const ProtegeRewardCell = ({ amount, percent, isLoading }) => {
  return isLoading ? (
    <Spinner />
  ) : (
    <RewardCell amount={amount} percent={percent} />
  )
}

ProtegeRewardCell.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  protegeid: PropTypes.string.isRequired,
  erc20: PropTypes.string.isRequired,
}

export default connect(
  (state, { protegeid, erc20 }) => ({
    isLoading: isInitialLoading(state, GET_BLOCKCHAIN_PROTEGE, [protegeid, erc20])
  })
)(
  React.memo(ProtegeRewardCell)
)