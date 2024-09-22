import React from 'react'
import PropTypes from 'prop-types'
import { timeSinceUnixTS } from '@oracly/pm-libs/date-utils'

import css from './DateCell.module.scss'

const DateCell = ({ date }) => {
  return (
    <span className={css.container}>
      {timeSinceUnixTS(date)}
    </span>
  )
}

DateCell.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default React.memo(DateCell)
