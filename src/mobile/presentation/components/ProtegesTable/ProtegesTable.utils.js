import React, { useMemo } from 'react'
import { div } from '@oracly/pm-libs/calc-utils'
import { get } from '@oracly/pm-libs/immutable'

import { withCellMeasurer } from '@components/common/Table'

import ProtegeRewardCell from './ProtegeRewardCell'
import ProtegeIdCell from './ProtegeIdCell'
import ActionsButton from './ActionsButton'

export const protege2TableData = (protege, { mentorid, erc20, earned }) => {
  const { protegeid, updatedAt, id } = protege

  const reward = get(protege, ['funds', 'mentor', mentorid, erc20, 'earned']) || 0
  const rewardPercent = earned && earned !== '0' ? div(reward, earned) : 0

  return {
    id,
    erc20,
    protegeid,
    updatedAt,
    reward,
    rewardPercent
  }
}

const cellRenderers = {
  protegeid: ({ cellData = '' }) => <ProtegeIdCell protegeid={cellData} />,
  reward: ({ rowData: { reward, rewardPercent, erc20, protegeid } }) => (
    <ProtegeRewardCell
      amount={reward}
      percent={rewardPercent}
      erc20={erc20}
      protegeid={protegeid}
    />
  ),
  actions: ({ rowData: { protegeid } }) => <ActionsButton protegeid={protegeid} />,
}

export const useColumns = ({ showActions }) => {
  return useMemo(() => {
    const columns = [
      { label: 'Protege', dataKey: 'protegeid', cellRenderer: withCellMeasurer(cellRenderers.protegeid), flexGrow: 1 },
      { label: 'Reward', dataKey: 'reward', cellRenderer: withCellMeasurer(cellRenderers.reward), flexGrow: 1 },
    ]

    if (showActions) columns.push({
      label: '',
      dataKey:'',
      cellRenderer: withCellMeasurer(cellRenderers.actions),
      alignRight: true,
    })

    return columns
  }, [showActions])
}