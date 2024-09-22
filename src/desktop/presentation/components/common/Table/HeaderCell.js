import React from 'react'

import css from './HeaderCell.module.scss'

const HeaderCell = ({ label }) => {
  if (!label) return null

  return (
    <span className={css.container}>
      <span className={css.label}>{label}</span>
    </span>
  )
}

HeaderCell.propTypes = {}

export default HeaderCell