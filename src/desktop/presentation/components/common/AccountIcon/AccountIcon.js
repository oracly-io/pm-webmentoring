import React from 'react'
import PropTypes from 'prop-types'
import cn from 'clsx'

import { toAccountAvatarUrl } from '@utils'

import css from './AccountIcon.module.scss'

const AccountIcon = ({ className, account = '', ...props }) => {
  return (
    <a
      className={cn(css.container, className)}
      style={{
        backgroundImage: `url(${toAccountAvatarUrl(account)})`,
        backgroundSize: 'cover'
      }}
      {...props}
    />
  )
}

AccountIcon.propTypes = {
  className: PropTypes.string,
  account: PropTypes.string,
}

export default AccountIcon
