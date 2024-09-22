import React from 'react'

import { TRANSFER_PROTEGE } from '@actions'
import Button from '@components/common/Button'
import Spinner from '@components/common/Spinner'
import { useModal } from '@hooks'
import { connect } from '@state'
import { isCommiting } from '@state/getters'

import TransferModal from '../TransferModal'

import css from './TransferButton.module.scss'

const modalClasses = { base: css.overlayBase }

const TransferButton = (props) => {
  const { protegeid, commiting } = props

  const { modal, open: openTransferModal } = useModal({
    type: 'primary',
    Content: TransferModal,
    protegeid,
    hideClose: true,
    modalClasses,
  })

  return (
    <div className={css.container}>
      <Button
        className={css.button}
        onClick={openTransferModal}
        disabled={commiting}
      >
        {commiting ? <Spinner /> : 'Transfer'}
      </Button>
      {modal}
    </div>
  )
}

export default connect(
  (state, { protegeid }) => {
    return {
      commiting: isCommiting(state, TRANSFER_PROTEGE, [protegeid])
    }
  }
)(TransferButton)