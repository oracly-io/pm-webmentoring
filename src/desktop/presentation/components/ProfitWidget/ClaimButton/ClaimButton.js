import React, { useCallback } from 'react'
import BalanceCurrency from '@oracly/pm-react-components/app/desktop/components/common/BalanceCurrency'

import { CLAIM_REWARD } from '@actions'
import { ERC20 } from '@constants'
import Spinner from '@components/common/Spinner'
import Button from '@components/common/Button'
import { connect } from '@state'
import { getActiveAccountAddress, getPageDataERC20, isCommiting } from '@state/getters'

import css from './ClaimButton.module.scss'

const ClaimButton = (props) => {
  const { commiting, erc20, reward, account } = props

  const claimable = !!Number(reward)
  const disabled = commiting || !claimable

  const handleClaim = useCallback(() => {
    props.CLAIM_REWARD({ erc20, reward, mentorid: account })
  }, [erc20, reward, account])

  return (
    <Button
      className={css.claim}
      onClick={handleClaim}
      disabled={disabled}
    >
      <BalanceCurrency className={css.currencyIcon} currency={ERC20[erc20]} fill="#009266" />
      <span className={css.content}>
        {commiting ? <Spinner /> : 'Claim'}
      </span>
    </Button>
  )
}

export default connect(
  (state) => {
    const erc20 = getPageDataERC20(state)
    const account = getActiveAccountAddress(state)
    const commiting = isCommiting(state, CLAIM_REWARD)

    return {
      erc20,
      account,
      commiting,
    }
  },
  ({ command }) => [
    command(CLAIM_REWARD),
  ]
)(React.memo(ClaimButton))