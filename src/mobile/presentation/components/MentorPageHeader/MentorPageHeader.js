import React from 'react'
import PropTypes from 'prop-types'

import { ERC20, LT } from '@constants'
import CurrencyField from '@components/common/CurrencyField'
import Button from '@components/common/Button'
import StatisticsChartIcon from '@components/SVG/StatisticsChartIcon'
import MentorStatsModal from '@components/MentorStatsModal'
import { useModal, useScheduledQuery } from '@hooks'
import { connect } from '@state'
import { getLatestbcBlockNumber, getMentor, getPageDataERC20 } from '@state/getters'
import { isInitialLoading, isNeverPerformed } from '@state/getters'
import { GET_BLOCKCHAIN_MENTOR } from '@state/actions'
import { getMentorErc20Funds } from '@utils'

import css from './MentorPageHeader.module.scss'

const MentorPageHeader = (props) => {
  const {
    erc20,
    mentorid,
    mentor,
    is_bc_blockNumberExist,
    isInitialMentorfundsLoading,
  } = props

  const { claimed, unclaimed, earned } = getMentorErc20Funds(mentor, erc20)

  const { modal, open: openMentorStatsModal } = useModal({
    type: 'secondary',
    Content: MentorStatsModal,
    claimed,
    unclaimed,
    earned,
    erc20,
  })

  useScheduledQuery((query, state) => {
    if (!is_bc_blockNumberExist) return

    const blockNumber = getLatestbcBlockNumber(state)

    const loadType = isNeverPerformed(state, GET_BLOCKCHAIN_MENTOR, [mentorid, erc20, LT.INITIAL])
      ? LT.INITIAL : LT.UPDATE
    query(GET_BLOCKCHAIN_MENTOR, { mentorid, erc20, loadType, txn: { blockNumber } }, { schedule: 300 })
  }, [mentorid, erc20, is_bc_blockNumberExist])

  return (
    <div className={css.container}>
      <CurrencyField
        spinnerClassName={css.spinner}
        label="Claimed"
        amount={claimed}
        currency={ERC20[erc20]}
        isLoading={isInitialMentorfundsLoading}
        withIcon
      />
      <Button
        className={css.statisticsBtn}
        onClick={openMentorStatsModal}
      >
        <StatisticsChartIcon />
      </Button>
      {modal}
    </div>
  )
}

MentorPageHeader.propTypes = {
  mentorid: PropTypes.string.isRequired
}

export default connect(
  (state, { mentorid }) => {
    const erc20 = getPageDataERC20(state)
    const mentor = getMentor(state, mentorid)
    const is_bc_blockNumberExist = !!getLatestbcBlockNumber(state)
    const isInitialMentorfundsLoading = isInitialLoading(state, GET_BLOCKCHAIN_MENTOR, [mentorid, erc20])

    return {
      erc20,
      mentor,
      is_bc_blockNumberExist,
      isInitialMentorfundsLoading,
    }
  },
)(MentorPageHeader)