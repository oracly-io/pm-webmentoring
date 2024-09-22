import React from 'react'
import { isEmpty } from 'lodash'
import NetworkModal from '@oracly/pm-react-components/app/mobile/components/NetworkModal'
import { formatDistanceUnixTS } from '@oracly/pm-libs/date-utils'

import { NETWORK_STATUS } from '@constants'
import { useScheduledCommand, useTranslation, useModal } from '@hooks'
import { connect } from '@state'
import { getLatestbcBlock, getNetworkStatus } from '@state/getters'

import css from './DataSyncModal.module.scss'

const modalClasses = { base: css.overlayBase }

const DataSyncModal = ({ bcblock, networkStatus }) => {

  const { t } = useTranslation()

  const { modal, isOpen, open, close } = useModal({
    type: 'primary',
    Content: NetworkModal,
    hideClose: true,
    modalClasses,
  })

  useScheduledCommand(() => {

    if (isEmpty(bcblock)) return

    if (networkStatus === NETWORK_STATUS.WARNING || networkStatus === NETWORK_STATUS.ERROR) {

      const rows = [
        { name: t('Block number'), value: bcblock.number },
        { name: t('Block age'), value: formatDistanceUnixTS(bcblock.timestamp) },
      ]

      open({ networkStatus, rows })

    } else {
      isOpen && close()
    }

  }, [isOpen, open, close, bcblock, networkStatus])

  return modal

}

export default connect(
  state => ({
    bcblock: getLatestbcBlock(state),
    networkStatus: getNetworkStatus(state),
  })
)(React.memo(DataSyncModal))