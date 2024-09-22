import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import Dropdown from '@oracly/pm-react-components/app/mobile/components/common/Dropdown'

import Expel from '../Expel'
import Transfer from '../Transfer'

import css from './ActionsButton.module.scss'

const ActionsButton = props => {

  const { protegeid } = props

  const options = useMemo(() => [
    { label: 'Transfer', renderer: () => <Transfer protegeid={protegeid} />},
    { label: 'Expel', renderer: () => <Expel protegeid={protegeid} />},
  ], [protegeid])

  const optionRenderer = useCallback(({ renderer }) => renderer(), [])

  const valueRenderer = useCallback(() => (
    <div className={css.dots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
  ), [])

  return (
    <Dropdown
      containerClassName={css.container}
      headerClassName={css.header}
      bodyClassName={css.body}
      optionClassName={css.option}
      iconColor="#DCE7CD"
      value="novalue"
      options={options}
      targetBody
      showIcon={false}
      valueRenderer={valueRenderer}
      optionRenderer={optionRenderer}
    />
  )
}

ActionsButton.propTypes = {
  protegeid: PropTypes.string.isRequired,
}

export default ActionsButton