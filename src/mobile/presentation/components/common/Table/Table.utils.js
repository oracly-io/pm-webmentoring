import React, { useEffect, useRef } from 'react'
import { CellMeasurer } from 'react-virtualized'
import { isFunction } from 'lodash'

export const tableConfig = {
  autoHeight: true,
  headerHeight: 56,
  rowHeight: 64,
}

const CellMeasurerContainer = ({
  cellData,
  columnIndex,
  rowIndex,
  parent,
  cache,
  forceRenderTable,
  children,
}) => {
  const measureRef = useRef()

  useEffect(() => {
    if (isFunction(measureRef.current)) {
      measureRef.current()
      forceRenderTable()
    }
  }, [cellData])

  return (
    <CellMeasurer
      columnIndex={columnIndex}
      rowIndex={rowIndex}
      parent={parent}
      cache={cache}
    >
      {({ measure }) => {
        measureRef.current = measure
        return children
      }}
    </CellMeasurer>
  )
}

export function withCellMeasurer(cellRenderer) {
  // eslint-disable-next-line react/display-name
  return (data) => {
    const { columnIndex, key, parent, rowIndex, columnData, cellData } = data
    const { cache, forceRenderTable } = columnData

    return (
      <CellMeasurerContainer
        key={key}
        cellData={cellData}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        parent={parent}
        cache={cache}
        forceRenderTable={forceRenderTable}
      >
        {cellRenderer(data)}
      </CellMeasurerContainer>
    )
  }
}