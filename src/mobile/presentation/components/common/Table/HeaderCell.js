import React from 'react'
import PropTypes from 'prop-types'
import cn from 'clsx'

import css from './HeaderCell.module.scss'

const HeaderCell = ({ className, label }) => {
  if (!label) return null

  return (
    <span className={cn(css.container, className)}>
      <span className={css.label}>{label}</span>
    </span>
  )
}

HeaderCell.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
}

export default HeaderCell