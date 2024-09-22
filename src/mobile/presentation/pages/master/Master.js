import 'react-virtualized/styles.css'
import React, { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import cn from 'clsx'

import config from '@config'
import { DARK_THEME } from '@constants'
import GlobalHeader from '@components/GlobalHeader'
import DataLoader from '@components/DataLoader'
import Claim from '@components/Claim'
import NotificationsWidget from '@components/NotificationsWidget'
import DataSyncModal from '@components/DataSyncModal'
import { useValidateParams } from '@hooks'
import Notfound from '@pages/notfound'
import { getActiveAccountAddress } from '@state/getters'
import { connect } from '@state'
import { getTheme } from '@state/getters/application'

import '@styles/app.scss'
import css from './Master.module.scss'

const Master = ({ account, theme }) => {

  const isValid = useValidateParams()
  const { mentorid } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const isConnected = !!window.localStorage.getItem('__connector')
    if (isConnected && account && !mentorid) {
      navigate(account, { replace: true })
    }
  }, [account, mentorid])

  return (
    <div
      className={cn(css.master, { dark: theme === DARK_THEME })}
    >
      <DataLoader />
      <GlobalHeader>
        <div className={css.webmentoring}>
          {isValid ? <Outlet/> : <Notfound />}
          <Claim />
        </div>
      </GlobalHeader>
      <NotificationsWidget />
      <DataSyncModal />
      <div id={config.modal_id} />
    </div>
  )
}

export default connect(
  state => ({
    theme: getTheme(state),
    account: getActiveAccountAddress(state),
  })
)(React.memo(Master))
