import PropTypes from 'prop-types'
import cn from 'clsx'
import React, { useCallback, useMemo, useState } from 'react'
import { WindowScroller, AutoSizer } from 'react-virtualized'
import { Table as VirtualizedTable, Column } from 'react-virtualized'
import { CellMeasurerCache } from 'react-virtualized'

import Spinner from '@components/common/Spinner'

import HeaderCell from './HeaderCell'
import HeaderRow from './HeaderRow'
import { tableConfig } from './Table.utils'

import css from './Table.module.scss'

const WindowScrollerChildren = React.memo(({
  width,
  height,
  scrollTop,
  onChildScroll,
  columns,
  headerCellRenderer,
  ...tableProps
}) => {
  const [, setCounter] = useState(0)

  const cache = useMemo(() => {
    return new CellMeasurerCache({
      defaultWidth: 50,
      minWidth: 0,
      fixedHeight: true,
    })
  }, [])

  const forceRenderTable = useCallback(() => setCounter(c => c + 1), [])
  const columnData = useMemo(() => ({ cache, forceRenderTable }), [])

  return (
    <VirtualizedTable
      {...tableConfig}
      width={width}
      height={height}
      scrollTop={scrollTop}
      onScroll={onChildScroll}
      deferredMeasurementCache={cache}
      {...tableProps}
    >
      {columns.map((column, index) => (
        <Column
          key={column.dataKey}
          width={cache.columnWidth({ index })}
          headerRenderer={headerCellRenderer}
          columnData={columnData}
          className={cn({ [css.columnAlignRight]: column.alignRight })}
          {...column}
        />
      ))}
    </VirtualizedTable>
  )
})
WindowScrollerChildren.displayName = 'WindowScrollerChildren'

const AutoSizerChildren = React.memo(({ width, columns, ...tableProps }) => {
  return (
    <WindowScroller>
      {({ height, scrollTop, onChildScroll }) => (
        <WindowScrollerChildren
          width={width}
          height={height}
          scrollTop={scrollTop}
          onChildScroll={onChildScroll}
          columns={columns}
          {...tableProps}
        />
      )}
    </WindowScroller>
  )
})
AutoSizerChildren.displayName = 'AutoSizerChildren'

const Table = ({
  className,
  headerRowClassName,
  headerCellClassName,
  headerColumnClassName,
  isLoading,
  columns,
  ...tableProps
}) => {

  const headerRowRenderer = useCallback(({ columns, style }) => (
    <HeaderRow className={cn(css.headerRow, headerRowClassName)} columns={columns} style={style} />
  ), [headerRowClassName])

  const headerCellRenderer = useCallback(({ label }) => (
    <HeaderCell className={cn(css.headerCell, headerCellClassName)} label={label} />
  ), [headerCellClassName])

  return (
    <div className={cn(css.container, className)}>
      <AutoSizer disableHeight>
        {({ width }) => (
          <AutoSizerChildren
            gridClassName={css.grid}
            rowClassName={css.row}
            headerClassName={cn(css.headerColumn, headerColumnClassName)}
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
  headerCellClassName: PropTypes.string,
  headerColumnClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  columns: PropTypes.array,
}

export default React.memo(Table)