import React from 'react'
import cn from 'clsx'

import { EXPEL, TRANSFER_PROTEGE } from '@actions'
import { connect } from '@state'
import { isCommiting } from '@state/getters'

import css from './ProtegesTableRow.module.scss'

const ProtegesTableRow = ({ columns, style, className, commiting }) => {
  return (
    <div
      className={cn(className, { [css.commiting]: commiting })}
      role="row"
      style={style}
    >
      {columns}
    </div>
  )
}
export default connect(
  (state, { rowData: { protegeid } }) => {
    return {
      commiting: isCommiting(state, EXPEL, [protegeid]) ||
        isCommiting(state, TRANSFER_PROTEGE, [protegeid])
    }
  },
)(React.memo(ProtegesTableRow))