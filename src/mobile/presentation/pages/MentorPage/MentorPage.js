import React from 'react'
import { useParams } from 'react-router-dom'

import MentorPageHeader from '@components/MentorPageHeader'
import ProtegesTable from '@components/ProtegesTable'

const MentorPage = () => {
  const { mentorid } = useParams()

  return (
    <>
      <MentorPageHeader mentorid={mentorid.toLowerCase()} />
      <ProtegesTable mentorid={mentorid.toLowerCase()} />
    </>
  )
}

export default MentorPage