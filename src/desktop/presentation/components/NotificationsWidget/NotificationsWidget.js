import React, { useCallback } from 'react'
import { Notifications } from '@oracly/pm-react-components/app/desktop'

import Wallet from '@components/SVG/Wallet'
import { useTranslate } from '@lib/i18n-utils'
import { connect } from '@state'
import { WALLET_CONNECT } from '@state/actions'
import { isLoading } from '@state/getters'

const NotificationsWidget = props => {

  const {
    isConnecting,
  } = props

  const t = useTranslate()

  const retry = useCallback(() => void (window.location.href = window.location.href), [])

  return (
    <Notifications.Widget>

      {isConnecting &&
        <Notifications.Item
          icon={<Wallet />}
          action={t('Retry')}
          onClick={retry}
          message={t('Complete activation in your web3 Wallet!')}
        />
      }

    </Notifications.Widget>
  )
}
export default connect(
  state => {
    const isConnecting = isLoading(state, WALLET_CONNECT)

    return {
      isConnecting,
    }
  }
)(React.memo(NotificationsWidget))