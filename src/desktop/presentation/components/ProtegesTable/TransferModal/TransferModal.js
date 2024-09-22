import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { isAddress } from 'ethers'
import AnimatedButton from '@oracly/pm-react-components/app/desktop/components/common/AnimatedButton'

import { TRANSFER_PROTEGE } from '@actions'
import { useTranslate } from '@lib/i18n-utils'
import MarkerUser from '@components/SVG/MarkerUser'
import { connect } from '@state'

import css from './TransferModal.module.scss'

const TransferModal = (props) => {
  const { protegeid, close } = props

  const [mentorid, setMentorid] = useState('')
  const [valid, setValid] = useState(false)

  const t = useTranslate()

  const handleTransfer = useCallback(() => {
    props.TRANSFER_PROTEGE({ protegeid, mentorid })
    close()
  }, [close, protegeid, mentorid])

  const handleChange = useCallback((e) => {
    const mentorid = e.target.value
    setMentorid(mentorid)

    if (isAddress(mentorid)) setValid(true)
    else setValid(false)
  }, [])

  return (
    <div className={css.container}>

      <span className={css.icon}>
        <MarkerUser />
      </span>

      <div className={css.description}>
        {t('Transferring protege to different mentor')}
      </div>

      <input
        className={css.mentorid}
        placeholder="Mentor address"
        value={mentorid}
        onChange={handleChange}
      />

      <div className={css.actions}>

        <AnimatedButton
          className={css.transfer}
          onClick={handleTransfer}
          disabled={!valid}
        >
          {t('Transfer')}
        </AnimatedButton>

        <AnimatedButton
          className={css.cancel}
          onClick={close}
        >
          {t('Cancel')}
        </AnimatedButton>

      </div>

    </div>
  )
}

TransferModal.propTypes = {
  protegeid: PropTypes.string.isRequired,
}

export default connect(
  null,
  ({ command }) => [command(TRANSFER_PROTEGE)]
)(TransferModal)