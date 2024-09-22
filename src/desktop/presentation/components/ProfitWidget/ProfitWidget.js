import React from 'react'

import { GET_BLOCKCHAIN_MENTOR } from '@actions'
import { LT, ERC20 } from '@constants'
import CurrencyField from '@components/common/CurrencyField'
import { useScheduledQuery } from '@hooks'
import { connect } from '@state'
import { getActiveAccountAddress, getLatestbcBlockNumber } from '@state/getters'
import { getMentor, isInitialLoading, isNeverPerformed } from '@state/getters'
import { getPageDataERC20 } from '@state/getters'
import { getMentorErc20Funds } from '@utils'

import ClaimButton from './ClaimButton'

import css from './ProfitWidget.module.scss'

const ProfitWidget = (props) => {
  const {
    erc20,
    mentor,
    mentorid,
    account,
    is_bc_blockNumberExist,
    isInitialMentorfundsLoading,
  } = props

  useScheduledQuery((query, state) => {
    if (!is_bc_blockNumberExist) return

    const blockNumber = getLatestbcBlockNumber(state)

    const loadType =  isNeverPerformed(state, GET_BLOCKCHAIN_MENTOR, [mentorid, erc20, LT.INITIAL])
      ? LT.INITIAL : LT.UPDATE
    query(GET_BLOCKCHAIN_MENTOR, { mentorid, erc20, loadType, txn: { blockNumber } }, { schedule: 300 })
  }, [mentorid, erc20, is_bc_blockNumberExist])

  const showClaimButton = account === mentorid

  const { claimed, unclaimed, earned } = getMentorErc20Funds(mentor, erc20)

  return (
    <div className={css.container}>
      <div className={css.stats}>
        <CurrencyField
          spinnerClassName={css.spinner}
          label="Claimed"
          amount={claimed}
          currency={ERC20[erc20]}
          isLoading={isInitialMentorfundsLoading}
          withIcon
        />
        <div className={css.divider} />
        <CurrencyField
          spinnerClassName={css.spinner}
          label="Earned"
          amount={earned}
          currency={ERC20[erc20]}
          isLoading={isInitialMentorfundsLoading}
        />
        <div className={css.divider} />
        <CurrencyField
          spinnerClassName={css.spinner}
          label="Unclaimed"
          amount={unclaimed}
          currency={ERC20[erc20]}
          isLoading={isInitialMentorfundsLoading}
        />
      </div>
      {showClaimButton && <ClaimButton reward={unclaimed} />}
    </div>
  )
}

export default connect(
  (state, { mentorid }) => {
    const erc20 = getPageDataERC20(state)
    const mentor = getMentor(state, mentorid)
    const account = getActiveAccountAddress(state)
    const isInitialMentorfundsLoading = isInitialLoading(state, GET_BLOCKCHAIN_MENTOR, [mentorid, erc20])
    const is_bc_blockNumberExist = !!getLatestbcBlockNumber(state)

    return {
      erc20,
      mentor,
      account,
      is_bc_blockNumberExist,
      isInitialMentorfundsLoading,
    }
  },
)(ProfitWidget)
