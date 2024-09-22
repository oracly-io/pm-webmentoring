import React, { useCallback, useMemo } from 'react'
import Modal from 'react-modal'
import cn from 'clsx'
import { mapValues } from 'lodash'
import PropTypes from 'prop-types'

import config from '@config'
import Button from '@components/common/Button'

import css from './SecondaryModal.module.scss'

const modalClassesDefault = {
  base: css.base,
  afterOpen: css.afterOpen,
  beforeClose: css.beforeClose,
}

const SecondaryModal = ({
  contentClassName,
  children,
  close,
  hideClose,
  modalClasses,
  ...modalProps
}) => {
  const parentSelector = useCallback(() => document.getElementById(config.modal_id), [])

  const mergedModalClasses = useMemo(() => {
    if (!modalClasses) return modalClassesDefault

    return mapValues(modalClassesDefault, (defalutClassName, key) => {
      const className = modalClasses[key]
      if (className) return cn(defalutClassName, className)
      return defalutClassName
    })
  }, [modalClasses])

  return (
    <Modal
      closeTimeoutMS={200}
      className={mergedModalClasses}
      overlayClassName={css.overlayBase}
      onRequestClose={close}
      parentSelector={parentSelector}
      {...modalProps}
    >
      <div className={css.container}>
        <div className={cn(css.content, contentClassName)}>{children}</div>
        <Button onClick={close} className={css.close}>
          Close
        </Button>
      </div>
    </Modal>
  )
}

SecondaryModal.propTypes = {
  contentClassName: PropTypes.string,
  close: PropTypes.func,
  hideClose: PropTypes.bool,
  modalClasses: PropTypes.object,
  children: PropTypes.node,
}

export default SecondaryModal
