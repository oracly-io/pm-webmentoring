import React from 'react'
import PropTypes from 'prop-types'

import css from './DropdownOption.module.scss'

const DropdownOption = ({
  option,
  renderer = (value) => value.label,
  onClick
}) => {
  return (
    <div
      className={css.option}
      onClick={() => onClick(option)}
    >
      {renderer(option)}
    </div>
  )
}

DropdownOption.propTypes = {
  option: PropTypes.any,
  onClick: PropTypes.func,
  renderer: PropTypes.func,
}

export default DropdownOption