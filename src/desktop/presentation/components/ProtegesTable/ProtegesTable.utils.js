import React, { useMemo } from 'react'
import { div } from '@oracly/pm-libs/calc-utils'
import { get } from '@oracly/pm-libs/immutable'

import ExpelButton from './ExpelButton'
import TransferButton from './TransferButton'
import ProtegeRewardCell from './ProtegeRewardCell'
import ProtegeIdCell from './ProtegeIdCell'
import JoinedAtCell from './JoinedAtCell'

export const protege2TableData = (protege, { mentorid, erc20, earned }) => {
  const { protegeid, id, updatedAt } = protege

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
  joinedAt: ({ cellData, rowData: { erc20, protegeid } }) => (
    <JoinedAtCell
      date={cellData}
      protegeid={protegeid}
      erc20={erc20}
    />
  ),
  expel: ({ rowData: { protegeid } }) => <ExpelButton protegeid={protegeid} />,
  transfer: ({ rowData: { protegeid } }) => <TransferButton protegeid={protegeid} />,
}

export const useColumns = ({ showActions }) => {
  return useMemo(() => {
    const columns = [
      { label: 'Protege', dataKey: 'protegeid', cellRenderer: cellRenderers.protegeid, flexGrow: 1 },
      { label: 'Reward', dataKey: 'reward', cellRenderer: cellRenderers.reward, flexGrow: 1 },
      { label: 'Joined', dataKey: 'updatedAt', cellRenderer: cellRenderers.joinedAt, flexGrow: 1 },
    ]

    if (showActions) columns.push({ label: '', dataKey: '', maxWidth: 144, cellRenderer: cellRenderers.transfer })
    if (showActions) columns.push({ label: '', dataKey: '', maxWidth: 127, cellRenderer: cellRenderers.expel })

    return columns
  }, [showActions])
}