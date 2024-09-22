import React from 'react'
import { useParams } from 'react-router-dom'

import ProfitWidget from '@components/ProfitWidget'
import ProtegesTable from '@components/ProtegesTable'

const WebMentoring = () => {
  const { mentorid } = useParams()

  return (
    <>
      <ProfitWidget mentorid={mentorid.toLowerCase()} />
      <ProtegesTable mentorid={mentorid.toLowerCase()} />
    </>
  )
}

export default WebMentoring