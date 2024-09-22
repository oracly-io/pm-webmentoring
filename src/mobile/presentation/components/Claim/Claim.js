import React, { useCallback } from 'react'
import BalanceCurrency from '@oracly/pm-react-components/app/mobile/components/common/BalanceCurrency'
import { useWallet } from '@oracly/pm-libs/crypto-wallet'

import { CLAIM_REWARD } from '@actions'
import { ERC20 } from '@constants'
import Button from '@components/common/Button'
import Spinner from '@components/common/Spinner'
import { connect } from '@state'
import { getActiveAccountAddress, getMentor } from '@state/getters'
import { getPageDataERC20, isCommiting } from '@state/getters'
import { getMentorErc20Funds } from '@utils'

import css from './Claim.module.scss'

const Claim = props => {

  const { commiting, erc20, reward, account } = props

  const wallet = useWallet()

  const claimable = !!Number(reward)
  const disabled = commiting || !claimable
  const isConnected = !!(wallet.ready && wallet.chain)

  const handleClaim = useCallback(() => {
    props.CLAIM_REWARD({ erc20, reward, mentorid: account })
  }, [erc20, reward, account])

  if (!account || !isConnected) return null

  return (
    <Button
      className={css.claim}
      onClick={handleClaim}
      disabled={disabled}
    >
      {commiting ? (
        <Spinner />
      ) : (
        <span className={css.content}>
          <BalanceCurrency
            className={css.currencyIcon}
            currency={ERC20[erc20]}
            fill="#009266"
          />
          Claim
        </span>
      )}
    </Button>
  )
}

export default connect(
  (state) => {
    const account = getActiveAccountAddress(state)
    const mentor = getMentor(state, account)
    const erc20 = getPageDataERC20(state)
    const commiting = isCommiting(state, CLAIM_REWARD)
    const { unclaimed } = getMentorErc20Funds(mentor, erc20)

    return {
      erc20,
      account,
      reward: unclaimed,
      commiting,
    }
  },
  ({ command }) => [
    command(CLAIM_REWARD),
  ]
)(React.memo(Claim))