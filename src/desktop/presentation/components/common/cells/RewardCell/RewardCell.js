import React from 'react'
import PropTypes from 'prop-types'
import { htmlCurrency, htmlPercent } from '@oracly/pm-libs/html-utils'

import css from './RewardCell.module.scss'

const RewardCell = ({ amount, percent }) => {
  return (
    <div className={css.container}>
      <span className={css.amount}>{htmlCurrency(amount)}</span>
      <span className={css.percent}>({htmlPercent(percent)})</span>
    </div>
  )
}

RewardCell.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default React.memo(RewardCell)