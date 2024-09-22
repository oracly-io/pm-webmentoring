import React from 'react'
import PropTypes from 'prop-types'

import AccountIcon from '@components/common/AccountIcon'
import { connect } from '@state'
import { getAccountNickname } from '@state/getters'

import css from './ProtegeIdCell.module.scss'

const ProtegeIdCell = ({ protegeid, nickname }) => {
  return (
    <div className={css.container}>
      <AccountIcon account={protegeid} />
      <span className={css.content}>
        {nickname && <span className={css.nickname}>{nickname}</span>}
        <span className={css.address}>{protegeid}</span>
      </span>
    </div>
  )
}

ProtegeIdCell.propTypes = {
  protegeid: PropTypes.string.isRequired
}

export default connect(
  (state, { protegeid }) => ({
    nickname: getAccountNickname(state, protegeid)
  })
)(
  React.memo(ProtegeIdCell)
)