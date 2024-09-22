import PropTypes from 'prop-types'
import cn from 'clsx'
import React, { useCallback } from 'react'
import { WindowScroller, AutoSizer, ColumnSizer } from 'react-virtualized'
import { Table as VirtualizedTable, Column } from 'react-virtualized'

import Spinner from '@components/common/Spinner'

import HeaderCell from './HeaderCell'
import HeaderRow from './HeaderRow'

import css from './Table.module.scss'

const columnSizerConfig = {
  columnMaxWidth: 10000,
  columnMinWidth: 50,
}

export const tableConfig = {
  autoHeight: true,
  headerHeight: 64,
  rowHeight: 80,
}

const WindowScrollerChildren = React.memo(({
  width,
  height,
  scrollTop,
  registerChild,
  onChildScroll,
  columns,
  columnWidth,
  headerCellRenderer,
  ...tableProps
}) => {
  return (
    <VirtualizedTable
      {...tableConfig}
      ref={registerChild}
      width={width}
      height={height}
      scrollTop={scrollTop}
      onScroll={onChildScroll}
      {...tableProps}
    >
      {columns.map((column) => (
        <Column
          key={column.dataKey}
          width={columnWidth}
          headerRenderer={headerCellRenderer}
          {...column}
        />
      ))}
    </VirtualizedTable>
  )
})
WindowScrollerChildren.displayName = 'WindowScrollerChildren'

const ColumnSizerChildren = React.memo(({ columnWidth, registerChild, width, columns, ...tableProps }) => {
  return (
    <WindowScroller>
      {({ height, scrollTop, onChildScroll }) => (
        <WindowScrollerChildren
          width={width}
          height={height}
          scrollTop={scrollTop}
          registerChild={registerChild}
          onChildScroll={onChildScroll}
          columns={columns}
          columnWidth={columnWidth}
          {...tableProps}
        />
      )}
    </WindowScroller>
  )
})
ColumnSizerChildren.displayName = 'ColumnSizerChildren'

const AutoSizerChildren = React.memo(({ width, columns, ...tableProps }) => {
  return (
    <ColumnSizer width={width} columnCount={columns.length} {...columnSizerConfig}>
      {({ columnWidth, registerChild }) => (
        <ColumnSizerChildren
          columnWidth={columnWidth}
          registerChild={registerChild}
          width={width}
          columns={columns}
          {...tableProps}
        />
      )}
    </ColumnSizer>
  )
})
AutoSizerChildren.displayName = 'AutoSizerChildren'

const Table = ({
  className,
  headerRowClassName,
  isLoading,
  columns,
  ...tableProps
}) => {

  const headerRowRenderer = useCallback(({ columns, style }) => (
    <HeaderRow className={headerRowClassName} columns={columns} style={style} />
  ), [headerRowClassName])

  const headerCellRenderer = useCallback(({ label }) => (
    <HeaderCell label={label} />
  ), [])

  return (
    <div className={cn(css.container, className)}>
      <AutoSizer disableHeight>
        {({ width }) => (
          <AutoSizerChildren
            gridClassName={css.grid}
            rowClassName={css.row}
            headerClassName={css.headerColumn}
            width={width}
            columns={columns}
            headerRowRenderer={headerRowRenderer}
            headerCellRenderer={headerCellRenderer}
            {...tableProps}
          />
        )}
      </AutoSizer>

      <div className={cn(css.spinnerContainer, { [css.show]: isLoading })}>
        <Spinner className={css.spinner} />
      </div>
    </div>
  )
}

Table.propTypes = {
  className: PropTypes.string,
  headerRowClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  columns: PropTypes.array,
}

export default React.memo(Table)