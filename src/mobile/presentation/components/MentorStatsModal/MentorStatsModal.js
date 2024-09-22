import React from 'react'
import PropTypes from 'prop-types'

import { ERC20 } from '@constants'
import CurrencyField from '@components/common/CurrencyField'

import css from './MentorStatsModal.module.scss'

const MentorStatsModal = ({ erc20, claimed, unclaimed, earned }) => {
  return (
    <div className={css.container}>
      <CurrencyField
        label="Claimed"
        amount={claimed}
        currency={ERC20[erc20]}
        withIcon
      />
      <CurrencyField
        label="Earned"
        amount={earned}
        currency={ERC20[erc20]}
        withIcon
      />
      <CurrencyField
        label="Unclaimed"
        amount={unclaimed}
        currency={ERC20[erc20]}
        withIcon
      />
    </div>
  )
}

MentorStatsModal.propTypes = {
  earned: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unclaimed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  claimed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default MentorStatsModal