import React from 'react'
import ProfileBar from '@oracly/pm-react-components/app/mobile/components/ProfileBar'

import config from '@config'
import ERC20Dropdown from '@components/ERC20Dropdown'

import css from './HeaderContent.module.scss'

const HeaderContent = ({
  isConnected,
  balance,
  currency,
  account,
  networkStatus,
  onProfileIconClick,
  onProfileCurrencyChanged,
}) => {
  return (
    <div className={css.container}>
      <a className={css.title} href={config.st_base_path}>Mentoring</a>
      {isConnected ? (
        <ProfileBar
          balance={balance}
          currency={currency}
          account={account}
          networkStatus={networkStatus}
          onIconClick={onProfileIconClick}
          onCurrencyChanged={onProfileCurrencyChanged}
        />
      ) : (
        <ERC20Dropdown />
      )}
    </div>
  )
}

export default HeaderContent
