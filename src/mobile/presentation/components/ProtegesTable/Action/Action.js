import React from 'react'
import PropTypes from 'prop-types'

import Spinner from '@components/common/Spinner'

import css from './Action.module.scss'

const Action = ({ label, isLoading, onClick }) => {
  return isLoading ? (
    <Spinner className={css.spinner} />
  ) : (
    <span className={css.action} onClick={onClick}>{label}</span>
  )
}

Action.propTypes = {
  label: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
}

export default Action