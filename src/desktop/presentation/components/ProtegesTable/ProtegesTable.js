import PropTypes from 'prop-types'
import React, { useCallback, useRef } from 'react'
import { isEmpty, isEqual, size } from 'lodash'
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { gt } from '@oracly/pm-libs/calc-utils'

import { GET_BLOCKCHAIN_PROTEGE } from '@actions'
import { GET_BLOCKCHAIN_TABLE_PROTEGES } from '@actions'
import { RESOVLE_ADDRESS_TO_NICKNAME } from '@actions'
import { LT } from '@constants'
import Table, { tableConfig } from '@components/common/Table'
import { useScheduledQuery, useInfiniteScroll } from '@hooks'
import { connect } from '@state'
import { getActiveAccountAddress, getLatestbcBlockNumber } from '@state/getters'
import { getPageDataERC20, getProtegesTotalSizeByAddress } from '@state/getters'
import { getTableProtegesFilter, isInitialLoading } from '@state/getters'
import { isNeverPerformed, isScrollLoading } from '@state/getters'
import { getTableProteges, isLoading } from '@state/getters'
import { getProteges, getMentor } from '@state/getters'
import { getMentorErc20Funds } from '@utils'
import { createProtegesTableFilter } from '@utils'

import { protege2TableData, useColumns } from './ProtegesTable.utils'
import ProtegesTableRow from './ProtegesTableRow'

import css from './ProtegesTable.module.scss'

const ProtegesTable = (props) => {
  const {
    account,
    mentor,
    mentorid,
    proteges,
    protegeids,
    erc20,
    is_bc_blockNumberExist,
    isInitialLoading,
    isScrollLoading,
  } = props

  const { earned } = getMentorErc20Funds(mentor, erc20)

  const columns = useColumns({
    showActions: account === mentorid,
    // showActions: true,
  })
  const navigate = useNavigate()
  const store = useStore()
  const renderedRowsRef = useRef({})

  const getRenderedProtegeids = useCallback((tableProtegeids) => {
    if (isEmpty(renderedRowsRef.current)) return []
    const { start, end } = renderedRowsRef.current
    const renderedProtegeids = tableProtegeids.slice(start, end + 1)
    return renderedProtegeids
  }, [])

  useInfiniteScroll(() => {
    const state = store.getState()
    const blockNumber = getLatestbcBlockNumber(state)
    const inProgress = isLoading(state, GET_BLOCKCHAIN_TABLE_PROTEGES)

    if (mentorid && blockNumber && !inProgress) {
      const tableProtegeids = getTableProteges(state)
      const protegesFilter = createProtegesTableFilter(mentorid)
      const offset = size(tableProtegeids)
      if (offset) {
        props.GET_BLOCKCHAIN_TABLE_PROTEGES({ ...protegesFilter, offset, loadType: LT.SCROLL })
      }
    }
  }, [mentorid])

  useScheduledQuery((query, state) => {
    if (!is_bc_blockNumberExist) return

    const renderedProtegeids = getRenderedProtegeids(protegeids)
    const newProtegeids = renderedProtegeids.filter((protegeid) =>
      isNeverPerformed(state, GET_BLOCKCHAIN_PROTEGE, [protegeid, erc20, LT.INITIAL])
    )

    if (!isEmpty(newProtegeids)) {
      const blockNumber = getLatestbcBlockNumber(state)

      for (const protegeid of newProtegeids) {
        query(GET_BLOCKCHAIN_PROTEGE, {
          protegeid,
          erc20,
          loadType: LT.INITIAL,
          txn: { blockNumber },
        }, { schedule: 1 })
      }

    }
  }, [is_bc_blockNumberExist, protegeids, erc20])

  useScheduledQuery((query, state) => {
    const renderedProtegeids = getRenderedProtegeids(protegeids)
    const newProtegeids = renderedProtegeids.filter((protegeid) =>
      isNeverPerformed(state, RESOVLE_ADDRESS_TO_NICKNAME, [protegeid, LT.INITIAL])
    )

    if (!isEmpty(newProtegeids)) {
      for (const protegeid of newProtegeids) {
        query(RESOVLE_ADDRESS_TO_NICKNAME, {
          address: protegeid,
          loadType: LT.INITIAL,
        }, { schedule: 1 })
      }

    }
  }, [protegeids])

  useScheduledQuery((query, state) => {
    if (!is_bc_blockNumberExist) return

    const tableProtegeids = getTableProteges(state)
    const blockNumber = getLatestbcBlockNumber(state)
    const inProgress = isLoading(state, GET_BLOCKCHAIN_TABLE_PROTEGES)
    const prevProtegesFilter = getTableProtegesFilter(state)
    const protegesFilter = createProtegesTableFilter(mentorid)
    const isFilterChanged = !isEqual(prevProtegesFilter, protegesFilter)

    // Load more rows to fill full page
    const viewableRowsCount = Math.ceil(document.documentElement.clientHeight / tableConfig.rowHeight)
    const tableSize = size(tableProtegeids)
    if (mentorid && !inProgress && viewableRowsCount > tableSize) {
      const totalSize = getProtegesTotalSizeByAddress(state, mentorid)

      if (tableSize && gt(totalSize, tableSize) && !isFilterChanged) {
        query(
          GET_BLOCKCHAIN_TABLE_PROTEGES,
          { ...protegesFilter, loadType: LT.FILL_PAGE, offset: tableSize, txn: { blockNumber } },
          { schedule: 30 }
        )
      }
    }

    // Load rows
    if (mentorid && !inProgress) {
      const loadType = isFilterChanged ? LT.INITIAL : LT.LOAD_NEW

      query(GET_BLOCKCHAIN_TABLE_PROTEGES, { ...protegesFilter, loadType, txn: { blockNumber } }, { schedule: 5 })
    }
  }, [is_bc_blockNumberExist, mentorid, erc20])

  const handleRowsRendered = useCallback(({ overscanStartIndex, overscanStopIndex }) => {
    renderedRowsRef.current = { start: overscanStartIndex, end: overscanStopIndex }
  }, [])

  const handleRowClick = useCallback(({ rowData }) => {
    navigate(`/${rowData.protegeid}`)
  }, [navigate])

  const rowGetter = useCallback(({ index }) =>
    protege2TableData(proteges[protegeids[index]], { mentorid, erc20, earned }),
    [protegeids, proteges, erc20, earned, mentorid]
  )

  const rowRenderer = useCallback(({ key, columns, rowData, style, className }) => (
    <ProtegesTableRow
      key={key}
      columns={columns}
      rowData={rowData}
      style={style}
      className={className}
    />
  ), [])

  return (
    <Table
      className={css.table}
      headerRowClassName={css.headerRow}
      isLoading={isInitialLoading || isScrollLoading}
      columns={columns}
      rowCount={isInitialLoading ? 0 : protegeids.length}
      rowGetter={rowGetter}
      rowRenderer={rowRenderer}
      onRowClick={handleRowClick}
      onRowsRendered={handleRowsRendered}
    />
  )
}

ProtegesTable.propTypes = {
  mentorid: PropTypes.string.isRequired,
}

export default connect(
  (state, { mentorid }) => {
    const account = getActiveAccountAddress(state)
    const mentor = getMentor(state, mentorid)
    const erc20 = getPageDataERC20(state)
    const proteges = getProteges(state)
    const protegeids = getTableProteges(state)
    const is_bc_blockNumberExist = !!getLatestbcBlockNumber(state)

    return {
      account,
      mentor,
      erc20,
      proteges,
      protegeids,
      is_bc_blockNumberExist,
      isInitialLoading: isInitialLoading(state, GET_BLOCKCHAIN_TABLE_PROTEGES),
      isScrollLoading: isScrollLoading(state, GET_BLOCKCHAIN_TABLE_PROTEGES),
    }
  },
  ({ query }) => [
    query(GET_BLOCKCHAIN_TABLE_PROTEGES),
  ]
)(ProtegesTable)
