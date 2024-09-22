import React from 'react'
import cn from 'clsx'

import css from './HeaderRow.module.scss'

const HeaderRow = ({ columns, style, className }) => {
  return (
    <div className={cn('ReactVirtualized__Table__headerRow', css.header, className)} role="row" style={style}>
      {columns}
    </div>
  )
}

export default HeaderRow