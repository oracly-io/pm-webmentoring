import React from 'react'
import PropTypes from 'prop-types'

import { TRANSFER_PROTEGE } from '@actions'
import { useModal } from '@hooks'
import { connect } from '@state'
import { isCommiting } from '@state/getters'

import TransferModal from '../TransferModal'
import Action from '../Action'

const Transfer = (props) => {
  const { protegeid, commiting } = props

  const { modal, open: openTransferModal } = useModal({
    type: 'secondary',
    Content: TransferModal,
    protegeid,
    hideClose: true,
  })

  return (
    <>
      <Action label="Transfer" isLoading={commiting} onClick={openTransferModal} />
      {modal}
    </>
  )
}

Transfer.propTypes = {
  protegeid: PropTypes.string.isRequired
}

export default connect(
  (state, { protegeid }) => {
    return {
      commiting: isCommiting(state, TRANSFER_PROTEGE, [protegeid])
    }
  }
)(Transfer)